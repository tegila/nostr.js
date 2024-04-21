const log = () => null; //console.log;
const { utils, schnorr } = require("@noble/secp256k1");
const { hex, bech32 } = require("@scure/base");

const defaults = {
  private_key: "",
  public_key: "",
  relays: [],
  profile: {
    name: "",
    display_name: "",
    website: "",
    nip05: "",
    picture: "",
    about: "",
    lud16: "",
  },
};

module.exports = (options) => {
  const profile = Object.assign({}, defaults, options);

  profile.__proto__.nsec = () => {
    if (profile.private_key)
      return bech32.encode(
        "nsec",
        bech32.toWords(hex.decode(profile.private_key))
      );
  };

  profile.__proto__.npub = (public_key) => {
    if (public_key)
      return bech32.encode("npub", bech32.toWords(hex.decode(public_key)));
  };

  profile.__proto__.new_private_key = () => {
    log("new_private_key");
    profile.private_key = hex.encode(utils.randomPrivateKey());

    return profile;
  };

  profile.__proto__.calc_public_key = () => {
    log("calc_public_key");
    profile.public_key = hex.encode(
      schnorr.getPublicKey(hex.decode(profile.private_key))
    );

    return profile;
  };

  profile.__proto__.sign = (hash) => {
    const signature = secp256k1.utils.bytesToHex(
      secp256k1.schnorr.signSync(hash, profile.private_key)
    );
    log(`signature: ${signature}`);
    return signature;
  };

  profile.__proto__.decode_nsec = (nsec) =>
    hex.encode(bech32.fromWords(bech32.decode(nsec).words));

  profile.__proto__.encode = (prefix, data) =>
    bech32.encode(prefix, bech32.toWords(hex.decode(data)));

  //log(profile);
  if (!profile.private_key) profile.new_private_key();
  else if (/^nsec/.test(profile.private_key))
    profile.private_key = profile.decode_nsec(profile.private_key);
  //log(profile);
  if (!profile.public_key) profile.calc_public_key();
  //log(profile);
  profile.nsec = profile.encode("nsec", profile.private_key);
  profile.npub = profile.encode("npub", profile.public_key);

  return profile;
};
