import * as fs from "fs-extra";
import { v4 } from "uuid";
import { db } from "../src/db.js";

export async function addAsset(logger: (msg: string) => void, id: string, file: string, label: string, mime: string) {
    logger(`id = ${id}\n`)
    logger(`reading data ...`);
    const data = await fs.readFile(file);
    logger(` finished\n`);
    logger(`read ${data.length} bytes\n`);
    logger("preparing database ...");
    await db.run("CREATE TABLE IF NOT EXISTS assets (id text primary key, data BLOB, mime text, size number, label text, changeId text)");
    logger(` finished\n`);
    logger("writing to database ...");
    // console.log({
    //     id,
    //     data,
    //     mime,
    //     size: data.length,
    //     label,
    //     changeId: v4(),
    // });
    await db.run("INSERT INTO assets (id,data,mime,size,label,changeId) VALUES (?,?,?,?,?,?)", [
        id,
        data,
        mime,
        data.length,
        label,
        v4(),
    ]);
    logger(` finished\n`);
    logger(`wrote ${data.length}bytes from '${file}' as '${id}' to database\n`);
    logger("@@@finish");
}