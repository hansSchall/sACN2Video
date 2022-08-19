import { Database, open, Statement } from "sqlite";
import { Database as SQLite3Database } from "sqlite3";
import { dbFile } from "../server.js";

export let db: Database;

export async function init_db() {
    db = await open({
        filename: dbFile,
        driver: SQLite3Database,
    })
    try {
        await Promise.all([db.run("PRAGMA journal_mode = TRUNCATE"),
        db.run(`CREATE TABLE IF NOT EXISTS assets (id text primary key, data BLOB, mime text, size number, label text, changeId text);`),
        db.run(`CREATE TABLE IF NOT EXISTS config_universes (universe number);`),
        db.run(`CREATE TABLE IF NOT EXISTS config_osc (ip TEXT, port number);`),
        db.run(`CREATE TABLE IF NOT EXISTS config (id TEXT, value TEXT);`),
        db.run(`CREATE TABLE IF NOT EXISTS els (id text,type text,enabled NUMBER DEFAULT 1,zi float default 0,PRIMARY KEY(id));`),
        db.run(`CREATE TABLE IF NOT EXISTS elProps (el text, prop text, valueType text, value text);`),
        db.run(`CREATE TABLE IF NOT EXISTS propMapping (el text, prop text, mapping text);`),
        ])
    } catch (err) {
        console.error(err);
    }
}