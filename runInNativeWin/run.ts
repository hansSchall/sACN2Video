global.callOptions = {
    delayInit: true,
}

import { app, BrowserWindow, dialog } from "electron";
import { main as serverMain } from "../server/server.js";

async function main() {
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
    const win = new BrowserWindow({
        autoHideMenuBar: true,
        title: "sACN2Video",
        backgroundColor: "#fe5000",
    })

    global.callOptions = {
        delayInit: true,
        portCb: (port: number) => {
            win.loadURL("http://localhost:" + port + "/");
        },
        file,
        randomPort: true
    }

    serverMain();




}

app.whenReady().then(main);