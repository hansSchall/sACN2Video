import { Client as OSCClient } from "node-osc";
import { db } from "./db";

const clients = new Set<OSCClient>();

export async function initOSC() {
    console.log("sending OSC to " + ((await db.all("SELECT ip, port FROM config_osc"))
        .map(({ ip, port }) => {
            clients.add(new OSCClient(ip, parseInt(port)));
            return `${ip}:${port}`
        }).map((val, ind, { length: len }) => ind ? ((ind == len - 1 ? " and " : ", ") + val) : val).join("")) || "none");
}

export function sendOSC(cmd: string[]) {
    console.log("osc", cmd);
    clients.forEach(cl => cl.send(cmd as any))
}