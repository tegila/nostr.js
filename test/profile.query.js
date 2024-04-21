const log = console.log;
const { DID, Note, Relay } = require("../");

const profile = require("./profile.json");

const me = DID(profile);
log(me);

const query = {
  kinds: [0],
  limit: 1,
  authors: [me.public_key],
};

me.relays.forEach((r) => {
  const relay = Relay(r);

  relay.message = (subscription_id, data) => {
    const note = Note(data);
    log(note);
    relay.close();
  };

  relay.connect(() => {
    relay.request(query);

    setTimeout(() => {
      log("timeout:", r);
      relay.close();
    }, 1000);
  });
});
