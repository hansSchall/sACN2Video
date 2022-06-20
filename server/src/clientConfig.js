"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientConfig = void 0;
const db_js_1 = require("./db.js");
async function clientConfig() {
    return JSON.stringify(await Promise.all((await db_js_1.db.all("SELECT id, type FROM els WHERE enabled = 1 ORDER BY zi"))
        .map(async (_) => [
        _.id,
        _.type,
        (await db_js_1.db.all("SELECT prop, valueType, value FROM elProps WHERE el = ?", _.id))
            .map(_ => ([_.prop, _.valueType, _.value]))
    ])));
}
exports.clientConfig = clientConfig;
