global.callOptions = {
    delayInit: true,
}

import { app, BrowserWindow, dialog } from "electron";
import { main as serverMain } from "../server/server.js";
import * as path from "path";

enum FileMode {
    View,
    Edit,
    EditSplit,
    Cancel
}

export let serverPort = 0;

async function main() {
    const startEditor = process.argv[3];
    let file = process.argv[2];
    if (!file) {
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
            properties: ["promptToCreate"]
        });
        if (dbFile.canceled) return app.quit();
        file = dbFile.filePaths[0];
    }
    const mode = await dialog.showMessageBox(null, {
        message: "Wie soll die Datei geöffnet werden?",
        buttons: [
            "Nur Anzeigen",
            "Bearbeiten",
            "Bearbeiten (Splitscreen)",
            "Abbrechen"
        ],
        cancelId: 3,
        title: "sACN2Video2 native",
        defaultId: 1,
    })
    if (mode.response === FileMode.Cancel) {
        app.quit();
    }
    let viewer: BrowserWindow;
    let editor: BrowserWindow;
    if (mode.response === FileMode.Edit || mode.response === FileMode.View) {
        viewer = new BrowserWindow({
            autoHideMenuBar: true,
            title: "sACN2Video",
            backgroundColor: "#fe5000",
        })
    }
    if (mode.response === FileMode.Edit || mode.response === FileMode.EditSplit) {
        editor = new BrowserWindow({
            autoHideMenuBar: true,
            title: "sACN2Video editor",
            backgroundColor: "#fe5000",
            webPreferences: {
                preload: path.join(__dirname, "./preload/preload.js")
            }
        })
    }
    global.callOptions = {
        delayInit: true,
        portCb: (port: number) => {
            serverPort = port;
            if (viewer) viewer.loadURL("http://localhost:" + port + "/");
            if (editor) editor.loadFile(path.join(__dirname, "../editor/frontend/editor.html"));
        },
        file,
        randomPort: true,
        editor: !!editor,
    }
    serverMain();
}

app.whenReady().then(main);