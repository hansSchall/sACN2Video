import { Client } from "node-osc";

const client = new Client("10.101.51.101", 3333);

export function sendOSC(cmd: string[]) {
    console.log("osc", cmd);
    client.send(cmd as any);
}