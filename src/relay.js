const log = () => null; //console.log;
const WebSocket = require("ws");

const secp256k1 = require("@noble/secp256k1");
const { hex, bech32 } = require("@scure/base");
const { sha256 } = require("@noble/hashes/sha256");
const crypto = require("crypto");

secp256k1.utils.sha256Sync = (...msgs) =>
  sha256(secp256k1.utils.concatBytes(...msgs));

module.exports = (url) => {
  const relay = Object.assign({}, { url });

  const message_callback = ({ data }) => {
    //console.log(data);
    const parsed_data = JSON.parse(data);
    const [type] = parsed_data;
    if (type === "EVENT") {
      const [, subscription_id, note] = parsed_data;
      //log(subscription_id, note);
      if (relay.message) relay.message(subscription_id, note);
    } else if (type === "EOSE") {
      relay.close();
    }
  };
  relay.close = () => relay.ws.close();

  relay.connect = (callback) => {
    const ws = new WebSocket(url);
    ws.addEventListener("open", () => callback());
    ws.addEventListener("message", message_callback);
    ws.addEventListener("error", log);
    //const ws = new WebSocket(url);
    //ws.on("error", log);
    //ws.on("open", () => callback());
    //ws.on("message", message_callback);
    relay.ws = ws;
  };

  const uuidv4 = () => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  };

  relay.request = (query) => {
    //log(query);

    const subscription_id = uuidv4();
    const req = ["REQ", subscription_id, query];
    //log(req);
    relay.ws.send(JSON.stringify(req));
  };

  relay.publish = (event) => {
    //log(event);
    relay.ws.send(JSON.stringify(["EVENT", event]));
  };

  return relay;
};
