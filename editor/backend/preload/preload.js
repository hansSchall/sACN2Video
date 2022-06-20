"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld("preload", {
    dialogAssetFile() {
        // return Promise.resolve("/Path/to/file")
        return electron_1.ipcRenderer.invoke("assetFileOpen");
    },
    aas(file, id, mime, label) {
        return electron_1.ipcRenderer.invoke("aas", file, id, mime, label);
    },
    aasLog(cb) {
        const channel = new MessageChannel();
        const port1 = channel.port1;
        const port2 = channel.port2;
        port2.onmessage = ev => {
            cb(ev.data);
        };
        electron_1.ipcRenderer.postMessage('aas-log', null, [port1]);
    },
    ellist() {
        return electron_1.ipcRenderer.invoke("ep.ellist");
    }
});
