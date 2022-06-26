import { BrowserWindow, dialog } from "electron";
import EventEmitter from "events";
import { Database } from "sqlite";
import { electron } from "../../runInNativeWin/electronLink.js";
import { enableEditorSplitscreen, serverPort } from "../../runInNativeWin/run.js";
import { addAsset } from "./asset.js";

interface DBElsFormat {
    id: string
    type: string
    enabled: string
    zi: string
}
interface DBPropFormat {
    el: string,
    prop: string,
    valueType: string,
    value: string,
}

async function warn(ev: Electron.IpcMainInvokeEvent, msg: string) {
    const res = await dialog.showMessageBox(getBrowserWindow(ev.sender), {
        message: msg,
        buttons: ["Löschen", "Abbrechen"],
    })
    return !res.response;//0 is OK, 1 is cancel
}

function getBrowserWindow(wc: Electron.WebContents): Electron.BrowserWindow {
    return BrowserWindow.fromWebContents(wc);
}

export const logger = new EventEmitter();

export function initEditor(db: Database) {
    electron.ipcMain.handle("list-els", (ev) => {
        return db.all("SELECT * from els ORDER BY zi ASC");
    })
    electron.ipcMain.handle("list-props", (ev, el: string) => {
        return db.all("SELECT * from elprops WHERE el = ?", el);
    })
    electron.ipcMain.handle("list-prop", (ev, el: string, prop: string) => {
        return db.all("SELECT * from elprops WHERE el = ? AND prop = ?", [el, prop]);
    })

    electron.ipcMain.handle("put-prop", (ev, prop: DBPropFormat) => {
        return db.all("UPDATE elprops SET valueType = ?, value = ? WHERE el = ? AND prop = ?", [
            prop.valueType,
            prop.value,
            prop.el,
            prop.prop,
        ]);
    })
    electron.ipcMain.handle("put-el", (ev, el: DBElsFormat) => {
        return db.all("UPDATE els SET type = ?, enabled = ?, zi = ? WHERE id = ?", [
            el.type,
            el.enabled,
            el.zi,
            el.id,
        ]);
    })

    electron.ipcMain.handle("add-el", (ev, id: string, type: string) => {
        return db.all("INSERT INTO els (id,type) VALUES (?,?)", [id, type]);
    })
    electron.ipcMain.handle("add-prop", (ev, el: string, prop: string) => {
        return db.all("INSERT INTO elprops (el,prop,value,valueType) VALUES (?,?,'','')", [el, prop]);
    })

    electron.ipcMain.handle("delete-el", async (ev, id: string) => {
        if (await warn(ev, `Element '${id}' wirklich löschen?`)) {
            await Promise.all([
                db.run("DELETE FROM elprops WHERE el = ?", id),
                db.run("DELETE FROM els WHERE id = ?", id)
            ]);
            return true;
        } else {
            return false;
        }
    })
    electron.ipcMain.handle("delete-prop", async (ev, el: string, prop: string) => {
        if (await warn(ev, `Eigenschaft '${el}.${prop}' wirklich löschen?`)) {
            await db.run("DELETE FROM elprops WHERE el = ? AND prop = ?", [el, prop]);
            return true;
        } else {
            return false;
        }
    })

    electron.ipcMain.handle("get-preview-url", () => {
        return "http://localhost:" + serverPort + "/"
    })

    electron.ipcMain.handle("list-assets", async (ev) => {
        return (await db.all("SELECT id from assets")).map(_ => _.id);
    })

    electron.ipcMain.handle("asset-file-dialog", async (ev) => {
        return (await dialog.showOpenDialog(getBrowserWindow(ev.sender), {
            "title": "Asset laden",
        })).filePaths[0];
    })

    electron.ipcMain.handle("add-asset", (ev, id: string, file: string, label: string, mime: string) => {
        return addAsset(process.stdout.write, id, file, label, mime);
    })

    electron.ipcMain.on("logger", (ev) => {
        const port = ev.ports[0]
        logger.on("data", (data) => {
            port.postMessage(data);
        })
        port.start();
    });

    electron.ipcMain.handle("is-splitscreen-enabled", () => enableEditorSplitscreen);
}