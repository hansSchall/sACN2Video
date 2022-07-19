import { Express } from "express";
import expressWs from "express-ws";
import { sendOSC } from "./osc";
import { senderEv } from "./sacn.js";
export function initSocket(app: expressWs.Application) {
    app.ws("/socket", (ws, req) => {
        senderEv.on("data", data => {
            ws.send(data);
        })
        ws.on("message", (data_) => {
            const data = data_.toString();
            if (data == "#clear") {
                senderEv.emit("clear");
                return;
            }
            if (data.startsWith("osc")) {
                const cmd = data.substring(3).split("=");
                sendOSC(cmd);
            }
        })

        senderEv.emit("clientconnected");
    })
}