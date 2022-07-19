class Sync {
    constructor(syncChan) {
        this.syncChan = syncChan;
    }
    startTC(time) {
        sendOSC([`eos/user/0/newcmd`, `Event ${this.syncChan} / Internal Enable Enter`]);
        sendOSC([`eos/user/0/newcmd`, `Event ${this.syncChan} / Time ${timeFormat(time)} Enter`]);
    }
    stopTC() {
        sendOSC([`eos/user/0/newcmd`, `Event ${this.syncChan} / Internal Disable Enter`]);
    }
    restartTC() {
        sendOSC([`eos/user/0/newcmd`, `Event ${this.syncChan} / Time 0 Enter`]);
    }
}
function sendOSC(cmd) {
    console.log("%c OSC:" + cmd.join("="), "color: #fa0");
    ws.send("osc" + cmd.join("="));
}
function timeFormat(time) {
    const d = new Date(time * 1000);
    return d.toISOString().substring(12, 19).replace(/\:/g, "") + toFixedLength(Math.round(d.getMilliseconds() * 1000 / 30).toString(), 2, "0");
}
function toFixedLength(str, len, buffer) {
    return buffer.substring(0, 1).repeat(Math.max(len - str.length, 0)) + str.substring(0, len);
}
// console.log(timeFormat(1))
// console.log(timeFormat(1.1))
// console.log(timeFormat(580))
//# sourceMappingURL=sync.js.map