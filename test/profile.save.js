const log = console.log;
const { DID, Note, Relay } = require("../");

const profile = require("./profile.json");
//
const me = DID(profile);
log(me.profile);
me.profile.random = "12345";

const note_0 = Note({
  // id: 0001, not possible
  kind: 0,
  content: JSON.stringify(me.profile),
});
log(note_0);

me.relays.forEach((r) => {
  const relay = Relay(r);

  relay.message = log;

  relay.connect(() => {
    relay.publish(note_0.sign(me));

    setTimeout(() => {
      log("timeout:", r);
      relay.close();
    }, 1000);
  });
});
