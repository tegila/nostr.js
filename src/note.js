const log = () => null; //console.log;
//import secp256k1 from "@noble/secp256k1";
const { sha256 } = require("@noble/hashes/sha256");

const secp256k1 = require("@noble/secp256k1");
const { hex, bech32 } = require("@scure/base");

secp256k1.utils.sha256Sync = (...msgs) =>
  sha256(secp256k1.utils.concatBytes(...msgs));

const defaults = {
  pubkey: "",
  id: "",
  kind: 1,
  content: "",
  tags: [],
  created_at: "",
  sig: "",
};

module.exports = (options) => {
  const note = Object.assign({}, defaults, options);
  if (note.created_at) note.created_at = new Date(note.created_at * 1000);
  else note.created_at = new Date(); //Math.floor(Date.now() / 1000);

  note.__proto__.serialize = () => {
    note.created_at = Math.floor(note.created_at / 1000);
    const note_string = JSON.stringify([
      0,
      note.pubkey,
      //Math.floor(note.created_at / 1000),
      note.created_at,
      note.kind,
      note.tags,
      note.content,
    ]);
    log(note_string);

    return note_string;
  };

  note.__proto__.hash = () => {
    const utf8Encoder = new TextEncoder();
    const hash = sha256(utf8Encoder.encode(note.serialize()));
    note.id = hex.encode(hash);
    log(`note.id: ${note.id}`);
    return note.id;
  };

  note.__proto__.sign = (did) => {
    note.pubkey = did.public_key;
    if (!note.id) note.hash();
    note.sig = secp256k1.utils.bytesToHex(
      secp256k1.schnorr.signSync(note.id, did.private_key)
    );
    log(`note.sig: ${note.sig}`);
    return note;
  };

  return note;
};
