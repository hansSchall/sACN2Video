import * as fs from "fs-extra";
import * as path from "path";
import { open } from "sqlite";
import { Database } from "sqlite3";
import { v4 } from "uuid";
import express from "express";

const dbFile = path.join(__dirname, process.argv[2]);
const assetFile = path.join(__dirname, process.argv[3]);
const assetID = process.argv[4];
const assetMime = process.argv[5];
const label = process.argv[6] || assetID;


async function main() {
    if (process.argv.length < 6) {
        console.log("call signature: node includeAsset.js [database] [assetFile] [id] [mime] [?label]")
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

    const db = await open({
        filename: dbFile,
        driver: Database,
    })
    const data = await fs.readFile(assetFile);
    console.log("read", data.length, "bytes");
    await db.run("CREATE TABLE IF NOT EXISTS assets (id text primary key, data BLOB, mime text, size number, label text, changeId text)");
    await db.run("INSERT INTO assets (id,data,mime,size,label,changeId) VALUES (%id,%data,%mime,%size,%label,%changeId)", {
        id: assetID,
        data,
        mime: assetMime,
        size: data.length,
        label,
        changeId: v4(),
    });
    console.log(`wrote ${data.length}bytes from '${assetFile}' as '${assetID}' to '${dbFile}'`);
}
main();