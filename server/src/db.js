"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init_db = exports.db = void 0;
const sqlite_1 = require("sqlite");
const sqlite3_1 = require("sqlite3");
const server_js_1 = require("../server.js");
async function init_db() {
    exports.db = await (0, sqlite_1.open)({
        filename: server_js_1.dbFile,
        driver: sqlite3_1.Database,
    });
    try {
        await Promise.all([exports.db.run("PRAGMA journal_mode = TRUNCATE"),
            exports.db.run(`CREATE TABLE IF NOT EXISTS assets (id text primary key, data BLOB, mime text, size number, label text, changeId text);`),
            exports.db.run(`CREATE TABLE IF NOT EXISTS config_universes (universe number);`),
            exports.db.run(`CREATE TABLE IF NOT EXISTS config_osc (ip TEXT, port number);`),
            exports.db.run(`CREATE TABLE IF NOT EXISTS config (id TEXT, value TEXT);`),
            exports.db.run(`CREATE TABLE IF NOT EXISTS els (id text,type text,enabled NUMBER DEFAULT 1,zi float default 0,PRIMARY KEY(id));`),
            exports.db.run(`CREATE TABLE IF NOT EXISTS elProps (el text, prop text, valueType text, value text);`)]);
    }
    catch (err) {
        console.error(err);
    }
}
exports.init_db = init_db;
