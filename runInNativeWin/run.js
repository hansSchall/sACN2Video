"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableEditorSplitscreen = exports.serverPort = void 0;
global.callOptions = {
    delayInit: true,
};
const electron_1 = require("electron");
const server_js_1 = require("../server/server.js");
const path = __importStar(require("path"));
var FileMode;
(function (FileMode) {
    FileMode[FileMode["View"] = 0] = "View";
    FileMode[FileMode["Edit"] = 1] = "Edit";
    FileMode[FileMode["EditSplit"] = 2] = "EditSplit";
    FileMode[FileMode["Cancel"] = 3] = "Cancel";
})(FileMode || (FileMode = {}));
exports.serverPort = 0;
exports.enableEditorSplitscreen = false;
async function main() {
    const startEditor = process.argv[3];
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
    const mode = await electron_1.dialog.showMessageBox(null, {
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
    });
    if (mode.response === FileMode.Cancel) {
        electron_1.app.quit();
    }
    let viewer;
    let editor;
    if (mode.response === FileMode.Edit || mode.response === FileMode.View) {
        viewer = new electron_1.BrowserWindow({
            autoHideMenuBar: true,
            title: "sACN2Video",
            backgroundColor: "#fe5000",
        });
    }
    if (mode.response === FileMode.Edit || mode.response === FileMode.EditSplit) {
        editor = new electron_1.BrowserWindow({
            autoHideMenuBar: true,
            title: "sACN2Video editor",
            backgroundColor: "#fe5000",
            webPreferences: {
                preload: path.join(__dirname, "./preload/preload.js")
            }
        });
    }
    if (mode.response === FileMode.EditSplit) {
        exports.enableEditorSplitscreen = true;
    }
    global.callOptions = {
        delayInit: true,
        portCb: (port) => {
            exports.serverPort = port;
            if (viewer)
                viewer.loadURL("http://localhost:" + port + "/");
            if (editor)
                editor.loadFile(path.join(__dirname, "../editor/frontend/editor.html"));
        },
        file,
        randomPort: true,
        editor: !!editor,
    };
    (0, server_js_1.main)();
}
electron_1.app.whenReady().then(main);
