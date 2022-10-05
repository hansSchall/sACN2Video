import { Router } from "express";
import { randomUUID } from "node:crypto";

const app = Router();

app.get("/config", (req, res) => {
    res.status(500).end();
})

let reloadID = randomUUID();

app.get("/reload/ping", (req, res) => {
    res.end(reloadID);
})

export function reloadApp() {
    reloadID = randomUUID();
}

export const api_v3_app_http = app;
