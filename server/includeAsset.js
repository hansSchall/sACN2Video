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
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const sqlite_1 = require("sqlite");
const sqlite3_1 = require("sqlite3");
const uuid_1 = require("uuid");
const dbFile = path.join(__dirname, process.argv[2]);
const assetFile = path.join(__dirname, process.argv[3]);
const assetID = process.argv[4];
const assetMime = process.argv[5];
const label = process.argv[6] || assetID;
async function main() {
    if (process.argv.length < 6) {
        console.log("call signature: node includeAsset.js [database] [assetFile] [id] [mime] [?label]");
    }
    // await 
    if (!await fs.pathExists(dbFile)) {
        console.error("database does not exist");
        process.exit(1);
        return;
    }
    if (!await fs.pathExists(assetFile)) {
        console.error("asset does not exist");
        process.exit(1);
        return;
    }
    const db = await (0, sqlite_1.open)({
        filename: dbFile,
        driver: sqlite3_1.Database,
    });
    const data = await fs.readFile(assetFile);
    console.log("read", data.length, "bytes");
    await db.run("CREATE TABLE IF NOT EXISTS assets (id text primary key, data BLOB, mime text, size number, label text, changeId text)");
    await db.run("INSERT INTO assets (id,data,mime,size,label,changeId) VALUES (%id,%data,%mime,%size,%label,%changeId)", {
        id: assetID,
        data,
        mime: assetMime,
        size: data.length,
        label,
        changeId: (0, uuid_1.v4)(),
    });
    console.log(`wrote ${data.length}bytes from '${assetFile}' as '${assetID}' to '${dbFile}'`);
}
main();
