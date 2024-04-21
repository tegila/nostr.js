const log = console.log;
const { DID } = require("../");

const me = DID({
  relays: ["wss://relay.damus.io", "wss://eden.nostr.land", "wss://nostr.wine"],
  profile: {
    name: "robot.tegila",
    display_name: "robot.tegila.js",
    website: "melhorque.com.br",
    nip05: "robot.tegila@melhorque.com.br",
    picture: "https://t.ly/OqkK",
    about: "parrot account",
    lud16: "parrot@ln.tips",
  },
});
log(JSON.stringify(me, null, 2));
