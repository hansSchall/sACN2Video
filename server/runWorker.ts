import { Worker } from "node:worker_threads";

async function main() {
    const w = new Worker("./server.js", {
        workerData: {
            port: "3000",
            file: "c:/hans/technik/theater2022/test.s2v",
        }
    })
    w.on('message', val => {
        console.log("Worker:", val);
    });
}
main();
