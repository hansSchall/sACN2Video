import { Express } from "express";
import expressWs from "express-ws";
import { senderEv } from "./sacn.js";
export function initSocket(app: expressWs.Application) {
    app.ws("/socket", (ws, req) => {
        senderEv.on("data", data => {
            ws.send(data);
        })
        ws.on("message", (data) => {
            if (data.toString() == "#clear") {
                senderEv.emit("clear");
                return;
            }
        })

        senderEv.emit("clientconnected");
    })
}