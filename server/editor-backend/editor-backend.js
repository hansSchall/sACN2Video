"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initEditor = exports.logger = void 0;
const electron_1 = require("electron");
const events_1 = __importDefault(require("events"));
const electronLink_js_1 = require("../../runInNativeWin/electronLink.js");
const run_js_1 = require("../../runInNativeWin/run.js");
const asset_js_1 = require("./asset.js");
async function warn(ev, msg) {
    const res = await electron_1.dialog.showMessageBox(getBrowserWindow(ev.sender), {
        message: msg,
        buttons: ["Löschen", "Abbrechen"],
    });
    return !res.response; //0 is OK, 1 is cancel
}
function getBrowserWindow(wc) {
    return electron_1.BrowserWindow.fromWebContents(wc);
}
exports.logger = new events_1.default();
function initEditor(db) {
    electronLink_js_1.electron.ipcMain.handle("list-els", (ev) => {
        return db.all("SELECT * from els ORDER BY zi ASC");
    });
    electronLink_js_1.electron.ipcMain.handle("list-props", (ev, el) => {
        return db.all("SELECT * from elprops WHERE el = ?", el);
    });
    electronLink_js_1.electron.ipcMain.handle("list-prop", (ev, el, prop) => {
        return db.all("SELECT * from elprops WHERE el = ? AND prop = ?", [el, prop]);
    });
    electronLink_js_1.electron.ipcMain.handle("put-prop", (ev, prop) => {
        return db.all("UPDATE elprops SET valueType = ?, value = ? WHERE el = ? AND prop = ?", [
            prop.valueType,
            prop.value,
            prop.el,
            prop.prop,
        ]);
    });
    electronLink_js_1.electron.ipcMain.handle("put-el", (ev, el) => {
        return db.all("UPDATE els SET type = ?, enabled = ?, zi = ? WHERE id = ?", [
            el.type,
            el.enabled,
            el.zi,
            el.id,
        ]);
    });
    electronLink_js_1.electron.ipcMain.handle("add-el", (ev, id, type) => {
        return db.all("INSERT INTO els (id,type) VALUES (?,?)", [id, type]);
    });
    electronLink_js_1.electron.ipcMain.handle("add-prop", (ev, el, prop) => {
        return db.all("INSERT INTO elprops (el,prop,value,valueType) VALUES (?,?,'','')", [el, prop]);
    });
    electronLink_js_1.electron.ipcMain.handle("delete-el", async (ev, id) => {
        if (await warn(ev, `Element '${id}' wirklich löschen?`)) {
            await Promise.all([
                db.run("DELETE FROM elprops WHERE el = ?", id),
                db.run("DELETE FROM els WHERE id = ?", id)
            ]);
            return true;
        }
        else {
            return false;
        }
    });
    electronLink_js_1.electron.ipcMain.handle("delete-prop", async (ev, el, prop) => {
        if (await warn(ev, `Eigenschaft '${el}.${prop}' wirklich löschen?`)) {
            await db.run("DELETE FROM elprops WHERE el = ? AND prop = ?", [el, prop]);
            return true;
        }
        else {
            return false;
        }
    });
    electronLink_js_1.electron.ipcMain.handle("get-preview-url", () => {
        return "http://localhost:" + run_js_1.serverPort + "/";
    });
    electronLink_js_1.electron.ipcMain.handle("list-assets", async (ev) => {
        return (await db.all("SELECT id from assets")).map(_ => _.id);
    });
    electronLink_js_1.electron.ipcMain.handle("asset-file-dialog", async (ev) => {
        return (await electron_1.dialog.showOpenDialog(getBrowserWindow(ev.sender), {
            "title": "Asset laden",
        })).filePaths[0];
    });
    electronLink_js_1.electron.ipcMain.handle("add-asset", (ev, id, file, label, mime) => {
        return (0, asset_js_1.addAsset)(process.stdout.write, id, file, label, mime);
    });
    electronLink_js_1.electron.ipcMain.on("logger", (ev) => {
        const port = ev.ports[0];
        exports.logger.on("data", (data) => {
            port.postMessage(data);
        });
        port.start();
    });
    electronLink_js_1.electron.ipcMain.handle("is-splitscreen-enabled", () => run_js_1.enableEditorSplitscreen);
}
exports.initEditor = initEditor;
