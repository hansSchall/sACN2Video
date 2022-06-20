"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sACNData = exports.ReceiverMerge = void 0;
const sacn_1 = require("sacn");
class ReceiverMerge extends sacn_1.Receiver {
    constructor({ timeout = 5000, ...props }) {
        super(props);
        this.timeout = timeout;
        super.on("packet", this.mergePacket);
    }
    timeout;
    senders = new Map();
    lastData = new sACNData();
    mergePacket(packet) {
        // used to identify each source (cid & universe)
        let sid = packet.universe.toString(36) + "     " + packet.cid.toString();
        // console.log(sid);
        if (!this.senders.has(sid))
            this.emit('senderConnect', {
                cid: packet.cid,
                universe: packet.universe,
                firstPacket: packet
            });
        this.senders.set(sid, {
            cid: packet.cid.toString(),
            data: new sACNData(packet.payload),
            prio: packet.priority,
            seq: packet.sequence
        });
        setTimeout(() => {
            if (this.senders.get(sid)?.seq == packet.sequence) {
                this.senders.delete(sid);
                // `packet` is the last packet the source sent
                this.emit('senderDisconnect', {
                    cid: packet.cid,
                    universe: packet.universe,
                    lastPacket: packet
                });
            }
            ;
        }, this.timeout);
        // detect which source has the highest per-universe priority
        let maximumPrio = 0;
        for (let [_, data] of this.senders) {
            if (data.prio > maximumPrio) {
                maximumPrio = data.prio;
            }
        }
        // HTP
        let mergedData = new sACNData();
        for (let [_, data] of this.senders) {
            if (data.prio == maximumPrio) {
                let i = 0;
                while (i < 512) {
                    let newValue = data.data.data[i] || 0;
                    if ((mergedData.data[i] ?? 0) < newValue)
                        mergedData.data[i] = newValue;
                    i++;
                }
            }
        }
        // console.log(mergedData);
        // only changes
        let i = 0;
        while (i < 512) {
            if (this.lastData.data[i] != mergedData.data[i]) {
                super.emit("changed", {
                    universe: packet.universe,
                    addr: i + 1,
                    newValue: mergedData.data[i],
                    oldValue: this.lastData.data[i]
                });
            }
            this.lastData.data[i] = mergedData.data[i] || 0;
            i++;
        }
        super.emit("changesDone");
    }
    clearCache() {
        // causes every addr value to be emitted
        this.lastData = new sACNData();
    }
    getSenders() {
        return [...this.senders.keys()].map(([cid, universe]) => ({ cid, universe }));
    }
}
exports.ReceiverMerge = ReceiverMerge;
class sACNData {
    data = new Array(512);
    constructor(recordData = {}) {
        this.data.fill(0);
        for (let addr in recordData) {
            this.data[+addr - 1] = recordData[+addr];
        }
    }
}
exports.sACNData = sACNData;
