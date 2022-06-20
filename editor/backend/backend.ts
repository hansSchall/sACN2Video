import { app, BrowserWindow, dialog, ipcMain } from "electron";
import { Database } from 'sqlite';
import { Database as Database3 } from 'sqlite3';
import * as fs from "fs/promises";
import { v4 } from 'uuid';
import { join } from "path";
import EventEmitter from "events";

app.commandLine.appendSwitch('force_high_performance_gpu');

async function main() {
    const aasLogIF = new EventEmitter();
    ipcMain.on("aas-log", (ev) => {
        const port = ev.ports[0]
        // setInterval(() => {
        //     port.postMessage("ping")
        // }, 2000);
        // port.on('message', (event) => {
        //     // data is { answer: 42 }
        //     const data = event.data
        // })
        aasLogIF.on("data", (data) => {
            port.postMessage(data);
        })
        port.start();
    });
    function aasLog(data: string) {
        aasLogIF.emit("data", data);
        process.stdout.write(data);
    }
    ipcMain.handle("assetFileOpen", async (ev) => {
        return (await dialog.showOpenDialog(null, {
            title: "Select Asset File"
        })).filePaths[0];
    })
    const dbFile = await dialog.showOpenDialog(null, {
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
    ipcMain.handle("aas", async (ev, file, id, mime, label) => {
        // const id = v4();
        aasLog(`id = ${id}\n`)
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
            v4(),
        ]);
        aasLog(` finished\n`);
        aasLog(`wrote ${data.length}bytes from '${file}' as '${id}' to '${dbFile.filePaths[0]}'\n`);
        aasLog("includeAsset.ts done");
        aasLog("@@@finish")
    })
    if (!dbFile.filePaths[0]) {
        app.quit();
        return;
    }
    // console.log(dbFile);

    process.stdout.write("reading Database ...")
    const db = new Database({
        driver: Database3,
        filename: dbFile.filePaths[0],
    })
    await db.open();
    await db.run("PRAGMA journal_mode = TRUNCATE");
    await Promise.all([db.run("PRAGMA journal_mode = TRUNCATE"),
    db.run(`CREATE TABLE IF NOT EXISTS assets (id text primary key, data BLOB, mime text, size number, label text, changeId text);`),
    db.run(`CREATE TABLE IF NOT EXISTS config_universes (universe number);`),
    db.run(`CREATE TABLE IF NOT EXISTS els (id text,type text,enabled NUMBER DEFAULT 1,zi float default 0,PRIMARY KEY(id));`),
    db.run(`CREATE TABLE IF NOT EXISTS elProps (el text, prop text, valueType text, value text);`)])
    console.log(" finished");
    console.log("SQLite journal_mode = TRUNCATE")
    const win = new BrowserWindow({
        backgroundColor: "black",
        webPreferences: {
            preload: join(__dirname, "preload/preload.js")
        }
    });
    win.loadFile(join(__dirname, "../frontend/editor.html"));
    win.webContents.toggleDevTools();
    win.maximize();




    ipcMain.handle("ep.ellist", () => {
        return db.all("SELECT * FROM els ORDER BY id");
    })
}
app.whenReady().then(main);