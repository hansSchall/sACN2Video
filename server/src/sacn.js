"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSacn = exports.senderEv = exports.encode = void 0;
const events_1 = __importDefault(require("events"));
const db_js_1 = require("./db.js");
const sacnMerge_js_1 = require("./sacnMerge.js");
function encode(chan, value) {
    return ("00" + value.toString(16).toUpperCase()).slice(-2) + chan.toString(36);
}
exports.encode = encode;
exports.senderEv = new events_1.default();
async function initSacn() {
    exports.senderEv.setMaxListeners(0);
    const universes = (await db_js_1.db.all("SELECT universe FROM config_universes")).map(_ => parseInt(_.universe));
    const sacn = new sacnMerge_js_1.ReceiverMerge({
        universes,
        reuseAddr: true,
        iface: "10.101.111.1"
    });
    console.log("sacn listening on", universes);
    let sendCache = [];
    exports.senderEv.on("clear", clear);
    function clear() {
        sendCache = [];
        sacn.clearCache();
    }
    sacn.on("changesDone", () => {
        if (!sendCache.length)
            return;
        exports.senderEv.emit("data", sendCache.join(";"));
        sendCache = [];
    });
    sacn.on("changed", (ev) => {
        // console.log(ev);
        sendCache.push(encode((ev.universe - 1) * 512 + ev.addr, Math.round(ev.newValue * 2.55)));
    });
}
exports.initSacn = initSacn;
