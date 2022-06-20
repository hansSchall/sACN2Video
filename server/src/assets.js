"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staticAssets = void 0;
const db_js_1 = require("./db.js");
function staticAssets(app) {
    app.get("/assets/:id", async (req, res) => {
        const changeId = (await db_js_1.db.get("SELECT changeId FROM assets WHERE id = ?", req?.params?.id ?? "")).changeId;
        const etag = req.get("If-None-Match");
        if (etag && etag == changeId) {
            res
                .status(304)
                .end();
        }
        else {
            db_js_1.db.get("SELECT data, mime, changeId FROM assets WHERE id = ?", [req?.params?.id]).then(row => {
                if (row) {
                    res
                        .status(200)
                        .contentType(row.mime || "application/octet-stream")
                        .set("etag", row.changeId)
                        .set("cache-control", "private")
                        .end(row.data);
                }
                else
                    res.status(404).end();
            }).catch(err => {
                console.log(err);
                res.status(500).end();
            });
        }
    });
    app.get("/assets", (req, res) => {
        db_js_1.db.all("SELECT id, size, label, mime FROM assets ORDER BY size ASC").then(rows => {
            res
                .status(200)
                .end(JSON.stringify(rows));
        }).catch(err => {
            console.log(err);
            res.status(500).end();
        });
    });
}
exports.staticAssets = staticAssets;
