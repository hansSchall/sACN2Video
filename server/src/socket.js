"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = void 0;
const osc_1 = require("./osc");
const sacn_js_1 = require("./sacn.js");
function initSocket(app) {
    app.ws("/socket", (ws, req) => {
        sacn_js_1.senderEv.on("data", data => {
            ws.send(data);
        });
        ws.on("message", (data_) => {
            const data = data_.toString();
            if (data == "#clear") {
                sacn_js_1.senderEv.emit("clear");
                return;
            }
            if (data.startsWith("osc")) {
                const cmd = data.substring(3).split("=");
                (0, osc_1.sendOSC)(cmd);
            }
        });
        sacn_js_1.senderEv.emit("clientconnected");
    });
}
exports.initSocket = initSocket;
