"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOSC = exports.initOSC = void 0;
const node_osc_1 = require("node-osc");
const db_1 = require("./db");
const clients = new Set();
async function initOSC() {
    console.log("sending OSC to " + ((await db_1.db.all("SELECT ip, port FROM config_osc"))
        .map(({ ip, port }) => {
        clients.add(new node_osc_1.Client(ip, parseInt(port)));
        return `${ip}:${port}`;
    }).map((val, ind, { length: len }) => ind ? ((ind == len - 1 ? " and " : ", ") + val) : val).join("")) || "none");
}
exports.initOSC = initOSC;
function sendOSC(cmd) {
    console.log("osc", cmd);
    clients.forEach(cl => cl.send(cmd));
}
exports.sendOSC = sendOSC;
