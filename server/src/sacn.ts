import EventEmitter from "events";
import { db } from "./db.js";
import { ReceiverMerge } from "./sacnMerge.js";

export function encode(chan: number, value: number) {
    return ("00" + value.toString(16).toUpperCase()).slice(-2) + chan.toString(36);
}
export const senderEv = new EventEmitter();
export async function initSacn() {
    senderEv.setMaxListeners(0);
    const universes = (await db.all("SELECT universe FROM config_universes")).map(_ => parseInt(_.universe));
    const sacn = new ReceiverMerge({
        universes,
        reuseAddr: true,
        // iface: "10.101.111.1"
    })
    console.log("sacn listening on", universes);
    let sendCache: string[] = [];
    senderEv.on("clear", clear);
    function clear() {
        sendCache = [];
        sacn.clearCache();
    }
    sacn.on("changesDone", () => {
        if (!sendCache.length) return;
        senderEv.emit("data", sendCache.join(";"));
        sendCache = [];
    });
    sacn.on("changed", (ev) => {
        // console.log(ev);
        sendCache.push(encode((ev.universe - 1) * 512 + ev.addr, Math.round(ev.newValue * 2.55)));
    })
}