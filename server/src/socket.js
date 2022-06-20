"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = void 0;
const sacn_js_1 = require("./sacn.js");
function initSocket(app) {
    app.ws("/socket", (ws, req) => {
        sacn_js_1.senderEv.on("data", data => {
            ws.send(data);
        });
        ws.on("message", (data) => {
            if (data.toString() == "#clear") {
                sacn_js_1.senderEv.emit("clear");
                return;
            }
        });
        sacn_js_1.senderEv.emit("clientconnected");
    });
}
exports.initSocket = initSocket;
