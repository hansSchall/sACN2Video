export let dbFile = "";
import * as fs from "fs-extra";
import * as path from "path";
import { isMainThread, workerData, parentPort } from "node:worker_threads";
import express from "express";
import { db, init_db } from "./src/db.js";
import { staticAssets } from "./src/assets.js";
import { initSacn } from "./src/sacn.js";
import { initSocket } from "./src/socket.js";
import expressWs from "express-ws";
import { clientConfig, clientConfigV2 } from "./src/clientConfig.js";
import { initOSC } from "./src/osc";
import { joincomma } from "./src/utils";

export async function start(dbFilePath: string, port: number) {
    if (!(await fs.pathExists(dbFilePath))) {
        console.log("resolved path:", dbFilePath);
        console.error("database does not exist");
        process.exit(1);
        return;
    }
    dbFile = dbFilePath;
    const app = express();
    const expWsApp = expressWs(app);

    app.enable('etag');

    app.set('etag', 'strong')

    app.use("/client", express.static(path.join(__dirname, "../client"), { index: "client.html" }));

    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, "../client/client.html"));
    })

    await init_db();

    console.log("reading database finished");

    Promise.all([
        initSacn(),
        initOSC(),
    ])

    registerExpressListener(app);

    if (port > 0) {
        app.listen(port, () => {
            console.log(`Listening on port ${port}`)
        });
    } else {
        const server = app.listen(() => {
            const addr = server.address();
            if (typeof addr == "string") {
                console.log("Error: cannot read port, Server is listening on pipe '" + addr + "'")
            } else {
                const port = addr.port;
                console.log(`Listening on port ${port}`);
                parentPort.postMessage({
                    type: "port",
                    port,
                })
            }
        })
    }
}

function registerExpressListener(app: express.Express) {
    staticAssets(app);

    app.get("/config", (req, res) => {
        clientConfig().then(config => {
            res.end(config);
        });
    })

    app.get("/config/v2", (req, res) => {
        clientConfigV2().then(config => {
            res.end(config);
        });
    })

    app.get("/report-to", async (req, res) => {
        const serverName: string = "ws://" +
            (
                (await db.get("SELECT value FROM config WHERE id = 'report-server'"))
                    ?.value
                || "localhost:81"
            )
            + "/";

        res.end(joincomma([serverName, dbFile]));
    })

    initSocket(app as any as expressWs.Application);
}

function main() {
    if (isMainThread) {
        // standalone/CLI mode
        const port = parseInt(process.argv[3]);
        if (isNaN(port) && process.argv[3] != "auto") {
            console.log(`API:
node server.js [database] [port]`);
            process.exit();
        }
        const file = path.resolve(process.argv[2]);
        start(file, port);
    } else {
        // worker mode
        const { port, file } = workerData;
        start(file, port);
    }
}

main();
