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
exports.addAsset = void 0;
const fs = __importStar(require("fs-extra"));
const uuid_1 = require("uuid");
const db_js_1 = require("../src/db.js");
async function addAsset(logger, id, file, label, mime) {
    logger(`id = ${id}\n`);
    logger(`reading data ...`);
    const data = await fs.readFile(file);
    logger(` finished\n`);
    logger(`read ${data.length} bytes\n`);
    logger("preparing database ...");
    await db_js_1.db.run("CREATE TABLE IF NOT EXISTS assets (id text primary key, data BLOB, mime text, size number, label text, changeId text)");
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
    await db_js_1.db.run("INSERT INTO assets (id,data,mime,size,label,changeId) VALUES (?,?,?,?,?,?)", [
        id,
        data,
        mime,
        data.length,
        label,
        (0, uuid_1.v4)(),
    ]);
    logger(` finished\n`);
    logger(`wrote ${data.length}bytes from '${file}' as '${id}' to database\n`);
    logger("@@@finish");
}
exports.addAsset = addAsset;
