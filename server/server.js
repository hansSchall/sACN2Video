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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = exports.dbFile = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
//@ts-ignore
if (!global?.callOptions)
    global.callOptions = {};
const port = callOptions?.port ?? parseInt(process.argv[3]);
if (isNaN(port) && !callOptions.delayInit) {
    console.log(`API:
node server.js [database] [port]`);
    process.exit();
}
exports.dbFile = "";
const express_1 = __importDefault(require("express"));
const db_js_1 = require("./src/db.js");
const assets_js_1 = require("./src/assets.js");
const sacn_js_1 = require("./src/sacn.js");
const socket_js_1 = require("./src/socket.js");
const express_ws_1 = __importDefault(require("express-ws"));
const clientConfig_js_1 = require("./src/clientConfig.js");
const osc_1 = require("./src/osc");
// import { join } from "path";
async function main() {
    let dbFile_ = callOptions?.file || path.resolve(process.argv[2]);
    if (!fs.pathExistsSync(dbFile_) && !callOptions?.file) {
        console.log("resolved path:", dbFile_);
        console.error("database does not exist");
        process.exit(1);
        return;
    }
    exports.dbFile = dbFile_;
    const app = (0, express_1.default)();
    const expWsApp = (0, express_ws_1.default)(app);
    app.enable('etag');
    app.set('etag', 'strong');
    app.use("/static-test", express_1.default.static(path.join(__dirname, "./test")));
    app.use("/client", express_1.default.static(path.join(__dirname, "../client"), { index: "client.html" }));
    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, "../client/client.html"));
    });
    process.stdout.write("reading file ...");
    (0, db_js_1.init_db)().then(async () => {
        console.log(" finished");
        (0, assets_js_1.staticAssets)(app);
        (0, sacn_js_1.initSacn)();
        (0, osc_1.initOSC)();
        (0, socket_js_1.initSocket)(app);
        app.get("/config", (req, res) => {
            (0, clientConfig_js_1.clientConfig)().then(config => {
                res.end(config);
            });
        });
        if (callOptions?.editor) {
            const mod = await Promise.resolve().then(() => __importStar(require("./editor-backend/editor-backend.js")));
            mod.initEditor(db_js_1.db);
        }
        if (callOptions?.randomPort) {
            const server = app.listen(() => {
                //@ts-ignore
                const port = server.address().port;
                console.log("using port", port);
                callOptions?.portCb?.(port);
            });
        }
        else {
            app.listen(port, () => {
                console.log(`Go to http://localhost:${port}/`);
            });
        }
    });
}
exports.main = main;
if (!callOptions?.delayInit)
    main();
