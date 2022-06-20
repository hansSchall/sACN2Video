"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const sqlite_1 = require("sqlite");
const sqlite3_1 = require("sqlite3");
const fs = __importStar(require("fs/promises"));
const uuid_1 = require("uuid");
const path_1 = require("path");
const events_1 = __importDefault(require("events"));
electron_1.app.commandLine.appendSwitch('force_high_performance_gpu');
async function main() {
    const aasLogIF = new events_1.default();
    electron_1.ipcMain.on("aas-log", (ev) => {
        const port = ev.ports[0];
        // setInterval(() => {
        //     port.postMessage("ping")
        // }, 2000);
        // port.on('message', (event) => {
        //     // data is { answer: 42 }
        //     const data = event.data
        // })
        aasLogIF.on("data", (data) => {
            port.postMessage(data);
        });
        port.start();
    });
    function aasLog(data) {
        aasLogIF.emit("data", data);
        process.stdout.write(data);
    }
    electron_1.ipcMain.handle("assetFileOpen", async (ev) => {
        return (await electron_1.dialog.showOpenDialog(null, {
            title: "Select Asset File"
        })).filePaths[0];
    });
    const dbFile = await electron_1.dialog.showOpenDialog(null, {
        title: "Select Database file",
        filters: [
            {
                extensions: ["s2v", "sacn2video"],
                name: "sACN2Video"
            },
            {
                extensions: ["*"],
                name: "All Files"
            },
        ],
        "properties": ["promptToCreate"]
    });
    // const dbFile = {
    //     filePaths: ["D:\\ts\\sACN2Video2\\server\\test.s2v"]
    // }
    electron_1.ipcMain.handle("aas", async (ev, file, id, mime, label) => {
        // const id = v4();
        aasLog(`id = ${id}\n`);
        aasLog(`reading data ...`);
        const data = await fs.readFile(file);
        aasLog(` finished\n`);
        aasLog(`read ${data.length} bytes\n`);
        aasLog("preparing database ...");
        await db.run("CREATE TABLE IF NOT EXISTS assets (id text primary key, data BLOB, mime text, size number, label text, changeId text)");
        aasLog(` finished\n`);
        aasLog("writing to database ...");
        // console.log({
        //     id,
        //     data,
        //     mime,
        //     size: data.length,
        //     label,
        //     changeId: v4(),
        // });
        await db.run("INSERT INTO assets (id,data,mime,size,label,changeId) VALUES (?,?,?,?,?,?)", [
            id,
            data,
            mime,
            data.length,
            label,
            (0, uuid_1.v4)(),
        ]);
        aasLog(` finished\n`);
        aasLog(`wrote ${data.length}bytes from '${file}' as '${id}' to '${dbFile.filePaths[0]}'\n`);
        aasLog("includeAsset.ts done");
        aasLog("@@@finish");
    });
    if (!dbFile.filePaths[0]) {
        electron_1.app.quit();
        return;
    }
    console.log(dbFile);
    process.stdout.write("reading Database ...");
    const db = new sqlite_1.Database({
        driver: sqlite3_1.Database,
        filename: dbFile.filePaths[0],
    });
    await db.open();
    await db.run("PRAGMA journal_mode = TRUNCATE");
    await Promise.all([db.run("PRAGMA journal_mode = TRUNCATE"),
        db.run(`CREATE TABLE IF NOT EXISTS assets (id text primary key, data BLOB, mime text, size number, label text, changeId text);`),
        db.run(`CREATE TABLE IF NOT EXISTS config_universes (universe number);`),
        db.run(`CREATE TABLE IF NOT EXISTS els (id text,type text,enabled NUMBER DEFAULT 1,zi float default 0,PRIMARY KEY(id));`),
        db.run(`CREATE TABLE IF NOT EXISTS elProps (el text, prop text, valueType text, value text);`)]);
    console.log(" finished");
    console.log("SQLite journal_mode = TRUNCATE");
    const win = new electron_1.BrowserWindow({
        backgroundColor: "black",
        webPreferences: {
            preload: (0, path_1.join)(__dirname, "preload/preload.js")
        }
    });
    win.loadFile((0, path_1.join)(__dirname, "../frontend/editor.html"));
    win.webContents.toggleDevTools();
    win.maximize();
    electron_1.ipcMain.handle("ep.ellist", () => {
        return db.all("SELECT * FROM els ORDER BY id");
    });
}
electron_1.app.whenReady().then(main);
