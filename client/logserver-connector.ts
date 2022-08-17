class Logserver {
    protected server: URL = new URL(location.href);
    protected target: string = "client (unconfigured)";
    public start(server: URL, target: string) {
        server.pathname = "/reporter";
        server.protocol = "ws://";
        this.server = server;
        this.target = target;
        this.connectWs();
    }
    protected ws: WebSocket | undefined;
    protected connectWs() {
        debugger;
        this.ws = new WebSocket(this.server);
        this.ws.addEventListener("open", this.onOpen.bind(this));
        this.ws.addEventListener("close", this.onClose.bind(this));
        this.ws.addEventListener("message", this.onMsg.bind(this));
        // this.ws.addEventListener("error", this.onError.bind(this));
    }
    protected _connected: boolean = false;
    protected sendLock = lock(true);
    protected onOpen() {
        this._connected = true;
        this.sendLock.unlock();
    }
    protected onClose() {
        this._connected = false;
        this.sendLock.lock();
        setTimeout(this.connectWs.bind(this), 200);
    }
    protected onMsg(ev: MessageEvent) {

    }
    protected onError() {

    }
    log(msg: string[] | string, type: string | "Log" | "Info" | "Warn" | "Error" = "Log") {
        const ts = timestamp();
        this.sendLock().then(() => {
            this.ws?.send(joincomma(["log", this.target, ...ts, type, ...(typeof msg == "string" ? [msg] : msg)]));
        })
    }
}

function splitcomma(joined: string) {
    return joined.split(/(?<!\\),/g).map(_ => _.replace(/\\(?!\\)/g, "").replace(/\\\\/g, "\\"))
}

function joincomma(splitted: string[]) {
    return splitted.map(_ => _.replace(/\\/g, "\\\\").replace(/,/g, "\\,")).join(",");
}

function log(msg: string[] | string, type: "Log" | "Info" | "Warn" | "Error" = "Log") {
    logserver.log(msg, type);
}

const format = new Intl.DateTimeFormat("de-de", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
})

function timestamp() {
    return [
        format.format(new Date()),
        "+" + Math.round(performance.now()),
    ]
}

function lock(lockedDefault = false): {
    (): Promise<void>,
    lock(): void,
    lock(locked: boolean): void,
    unlock(): void,
    locked: boolean,
} {
    const waiting: VoidFunction[] = [];
    let locked: boolean = lockedDefault;
    const lock = function () {
        return new Promise<void>(
            resolve => {
                if (locked)
                    waiting.push(resolve);
                else
                    resolve();
            }
        );
    };
    lock.unlock = () => {
        locked = false;
        while (!locked && waiting.length) {
            waiting.shift()?.();
        }
    };
    lock.lock = (locked_: boolean) => {
        if (locked_ === false) lock.unlock();
        locked = true;
    };
    Object.defineProperty(lock, "locked", {
        get() {
            return locked;
        },
        set(locked) {
            lock.lock(locked);
        }
    });
    return lock as any;
};
