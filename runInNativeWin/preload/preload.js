"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld("preload", {
    list: {
        els() {
            return electron_1.ipcRenderer.invoke("list-els");
        },
        props(el, prop) {
            if (prop) {
                return electron_1.ipcRenderer.invoke("list-prop", el, prop);
            }
            else {
                return electron_1.ipcRenderer.invoke("list-props", el);
            }
        }
    },
    put: {
        el(el) {
            return electron_1.ipcRenderer.invoke("put-el", el);
        },
        prop(prop) {
            return electron_1.ipcRenderer.invoke("put-prop", prop);
        }
    },
    add: {
        el(id, type) {
            return electron_1.ipcRenderer.invoke("add-el", id, type);
        },
        prop(el, prop) {
            return electron_1.ipcRenderer.invoke("add-prop", el, prop);
        }
    },
    delete: {
        el(id) {
            return electron_1.ipcRenderer.invoke("delete-el", id);
        },
        prop(el, prop) {
            return electron_1.ipcRenderer.invoke("delete-prop", el, prop);
        }
    },
    getPreviewUrl() {
        return electron_1.ipcRenderer.invoke("get-preview-url");
    },
    getPreviewMode() {
        return electron_1.ipcRenderer.invoke("get-preview-mode");
    },
    assets: {
        list() {
            return electron_1.ipcRenderer.invoke("list-assets");
        },
        fileDialog() {
            return electron_1.ipcRenderer.invoke("asset-file-dialog");
        },
        add(id, file, label, mime) {
            return electron_1.ipcRenderer.invoke("add-asset", id, file, label, mime);
        }
    },
    startLogger(onMsg) {
        const channel = new MessageChannel();
        const port1 = channel.port1;
        const port2 = channel.port2;
        port2.onmessage = ev => {
            onMsg(ev.data);
        };
        electron_1.ipcRenderer.postMessage('logger', null, [port1]);
    }
});
