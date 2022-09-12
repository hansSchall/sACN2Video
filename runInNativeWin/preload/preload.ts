import { contextBridge, ipcRenderer } from "electron";

interface DBElsFormat {
    id: string
    type: string
    enabled: string
    zi: string
}
interface DBPropsFormat {
    el: string,
    prop: string,
    valueType: string,
    value: string,
}

contextBridge.exposeInMainWorld("preload", {
    list: {
        els() {
            return ipcRenderer.invoke("list-els")
        },
        props(el: string, prop?: string) {
            if (prop) {
                return ipcRenderer.invoke("list-prop", el, prop)
            } else {
                return ipcRenderer.invoke("list-props", el)
            }
        }
    },
    put: {
        el(el: DBElsFormat) {
            return ipcRenderer.invoke("put-el", el);
        },
        prop(prop: DBPropsFormat) {
            return ipcRenderer.invoke("put-prop", prop);
        }
    },
    add: {
        el(id: string, type: string) {
            return ipcRenderer.invoke("add-el", id, type);
        },
        prop(el: string, prop: string) {
            return ipcRenderer.invoke("add-prop", el, prop);
        }
    },
    delete: {
        el(id: string) {
            return ipcRenderer.invoke("delete-el", id);
        },
        prop(el: string, prop: string) {
            return ipcRenderer.invoke("delete-prop", el, prop);
        }
    },
    getPreviewUrl() {
        return ipcRenderer.invoke("get-preview-url");
    },
    getPreviewMode() {
        return ipcRenderer.invoke("get-preview-mode");
    },
    runSQL(sql: string): Promise<any> {
        return ipcRenderer.invoke("run-sql", sql);
    },
    assets: {
        list(): Promise<string[]> {
            return ipcRenderer.invoke("list-assets");
        },
        fileDialog(): Promise<string | undefined> {
            return ipcRenderer.invoke("asset-file-dialog");
        },
        add(id: string, file: string, label: string, mime: string): Promise<void> {
            return ipcRenderer.invoke("add-asset", id, file, label, mime);
        },
        delete(id: string) {
            return ipcRenderer.invoke("delete-asset", id);
        }
    },
    startLogger(onMsg: (msg: string) => void) {
        const channel = new MessageChannel()
        const port1 = channel.port1
        const port2 = channel.port2
        port2.onmessage = ev => {
            onMsg(ev.data);
        };
        ipcRenderer.postMessage('logger', null, [port1])
    },
    isSplitscreenEnabled() {
        return ipcRenderer.invoke("is-splitscreen-enabled");
    }
})
