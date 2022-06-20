"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
global.callOptions = {
    delayInit: true,
};
const electron_1 = require("electron");
const server_js_1 = require("../server/server.js");
async function main() {
    let file = process.argv[2];
    if (!file) {
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
            properties: ["promptToCreate"]
        });
        if (dbFile.canceled)
            return electron_1.app.quit();
        file = dbFile.filePaths[0];
    }
    const win = new electron_1.BrowserWindow({
        autoHideMenuBar: true,
        title: "sACN2Video",
        backgroundColor: "#fe5000",
    });
    global.callOptions = {
        delayInit: true,
        portCb: (port) => {
            win.loadURL("http://localhost:" + port + "/");
        },
        file,
        randomPort: true
    };
    (0, server_js_1.main)();
}
electron_1.app.whenReady().then(main);
