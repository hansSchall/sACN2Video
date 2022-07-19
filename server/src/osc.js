"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOSC = void 0;
const node_osc_1 = require("node-osc");
const client = new node_osc_1.Client("10.101.51.101", 3333);
function sendOSC(cmd) {
    console.log("osc", cmd);
    client.send(cmd);
}
exports.sendOSC = sendOSC;
