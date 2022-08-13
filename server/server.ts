import * as fs from "fs-extra";
import * as path from "path";
//@ts-ignore
if (!global?.callOptions) global.callOptions = {} as any;
const port = callOptions?.port ?? parseInt(process.argv[3]);
if (isNaN(port) && !callOptions.delayInit) {
    console.log(`API:
node server.js [database] [port]`);
    process.exit();
}
export let dbFile = "";
import express from "express";
import { db, init_db } from "./src/db.js";
import { staticAssets } from "./src/assets.js";
import { initSacn } from "./src/sacn.js";
import { initSocket } from "./src/socket.js";
import expressWs from "express-ws";
import { clientConfig } from "./src/clientConfig.js";
import { initOSC } from "./src/osc";
// import { join } from "path";

export async function main() {
    let dbFile_ = callOptions?.file || path.resolve(process.argv[2]);
    if (!fs.pathExistsSync(dbFile_) && !callOptions?.file) {
        console.log("resolved path:", dbFile_);
        console.error("database does not exist");
        process.exit(1);
        return;
    }
    dbFile = dbFile_;
    const app = express();
    const expWsApp = expressWs(app);

    app.enable('etag');

    app.set('etag', 'strong')

    app.use("/static-test", express.static(path.join(__dirname, "./test")));

    app.use("/client", express.static(path.join(__dirname, "../client"), { index: "client.html" }));

    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, "../client/client.html"));
    })

    process.stdout.write("reading file ...");

    init_db().then(async () => {
        console.log(" finished");
        staticAssets(app);
        initSacn();
        initOSC();
        initSocket(app as any as expressWs.Application);
        app.get("/config", (req, res) => {
            clientConfig().then(config => {
                res.end(config);
            });
        })
        app.get("/report-to", (req, res) => {
            res.end(dbFile);
        })
        if (callOptions?.editor) {
            const mod = await import("./editor-backend/editor-backend.js")
            mod.initEditor(db);
        }
        if (callOptions?.randomPort) {
            const server = app.listen(() => {
                //@ts-ignore
                const port = server.address().port;
                console.log("using port", port);
                callOptions?.portCb?.(port);
            })
        } else {
            app.listen(port, () => {
                console.log(`Go to http://localhost:${port}/`)
            });
        }
    })
}

if (!callOptions?.delayInit) main();