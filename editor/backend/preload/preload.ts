import { contextBridge, dialog, ipcRenderer, webContents } from "electron";

contextBridge.exposeInMainWorld("preload", {
    dialogAssetFile() {
        // return Promise.resolve("/Path/to/file")
        return ipcRenderer.invoke("assetFileOpen");
    },
    aas(file: string, id: string, mime: string, label: string) {
        return ipcRenderer.invoke("aas", file, id, mime, label);
    },
    aasLog(cb: (data: string) => void) {

        const channel = new MessageChannel()
        const port1 = channel.port1
        const port2 = channel.port2
        port2.onmessage = ev => {
            cb(ev.data);
        };
        ipcRenderer.postMessage('aas-log', null, [port1])
    },
    ellist() {
        return ipcRenderer.invoke("ep.ellist");
    }
})
