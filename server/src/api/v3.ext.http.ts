import { Router } from "express";
import * as fs from "fs-extra";
import { join } from "path";
import { v4 as uuid4 } from "uuid";
import { db } from "../db";
import { reloadApp } from "./v3.app.http";

export const app = Router();

app.get("/run-sql", (req, res) => {
    const sql = req.query?.sql;
    const token = req.query?.token;
    const params = JSON.parse(req.query?.params?.toString() || "{}");
    console.log("Running SQL query:", sql);
    db.all(sql.toString(), params).then(dbRes => {
        res.end(
            JSON.stringify(dbRes, (k, v) => {
                if (v?.type == "Buffer")
                    return "<BLOB>";
                return v;
            })

        );
    }).catch((err) => {
        console.log("db error", err);
        res.status(500).end();
    })
})

app.post("/add-asset", async (req, res) => {
    console.log("/add-asset")
    const file = req.files?.file;
    const label = req.body?.label;
    const id = req.body?.id;
    console.log({
        label, id,
    })
    if (file) {
        if (Array.isArray(file)) {
            res.status(400).end();
        } else {
            if (!file.size || !label || !id) {
                res.status(400).end();
            }

            console.log({
                size: file.size,
                mime: file.mimetype,
                checksum: file.md5,
                bufferSize: file.data.length,
            })

            try {
                await db.run("CREATE TABLE IF NOT EXISTS assets (id text primary key, data BLOB, mime text, size number, label text, changeId text)");

                await db.run("INSERT INTO assets (id,data,mime,size,label,changeId) VALUES (?,?,?,?,?,?)", [
                    id,
                    file.data,
                    file.mimetype,
                    file.size,
                    label,
                    uuid4(),
                ]);

            } catch (err) {
                console.error(err);
                res.status(500).end();
                return;
            }
            res.status(204).end();
        }
    } else {
        res.status(400).end("no file");
    }
})

app.get("/add-asset", (req, res) => {
    res.sendFile(join(__dirname, "../../../client/test/file-upload.html"))
})


app.get("/reload", (req, res) => {
    reloadApp();
    res.status(204).end();
})


export const api_v3_ext_http = app;
