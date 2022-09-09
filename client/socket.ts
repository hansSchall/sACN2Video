function initSocket() {
    connectWS();
}

let ws: WebSocket;

function connectWS() {
    let url = new URL(location.href);
    url.protocol = "ws";
    url.pathname = "/socket";
    ws = new WebSocket(url);
    ws.addEventListener("open", () => {
        console.log("%cconnected WebSocket", "display: block;color: black;background: green; text-align: center;padding: 3px");
        ws.send("#clear");
        sacnListener.forEach((value, key) => {
            value.forEach(_ => _(0));
        })
    })
    ws.addEventListener("message", (ev) => {
        // console.log(ev.data);
        let msg: string = ev.data;
        if (msg.substring(0, 1) == "#") {
            msg = msg.substring(1);
            switch (msg) {
                case "ping":
                    ws.send("pong");
                    break;
            }
        } else {
            msg.split(";").forEach(parseValue);
        }
    })
    ws.addEventListener("close", (ev) => {
        console.log('%cSocket is closed. Reconnect will be attempted in 1 second.', "display: block;color: black;background: red; text-align: center;padding: 3px", ev.reason);
        setTimeout(function () {
            connectWS();
        }, 1000);
    })
    ws.addEventListener("error", (ev) => {
        console.error('Socket encountered error | Closing socket');
        ws.close();
    })
}

function addSacnListener(addr: number, listener: (this: Elmnt, value: number) => void) {
    if (sacnListener.has(addr)) {
        sacnListener.get(addr)?.add(listener);
    } else {
        sacnListener.set(addr, new Set([listener]));
    }
}

function parseValue(value: string) {
    const valuePart = parseInt(value.substring(0, 2), 16);
    const addrPart = parseInt(value.substring(2), 36);
    sacnListener.get(addrPart)?.forEach(_ => _(valuePart));
    // console.log(addrPart, "=", valuePart)
}

function clear() {
    ws.send("#clear");
}

const sacnListener = new Map<number, Set<((value: number) => void)>>();
