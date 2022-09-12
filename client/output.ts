function timeSinceAppStart() {
    return Date.now() - firstScriptTimestamp + "ms";
}
const logserver = new Logserver();
function init() {
    log(["client", "starting"]);
    log(["client", "init", "flags", `#define TRANSFORM ${flags.transform ? "ENABLED" : "DISABLED"}`], "Info");
    log(["client", "init", "flags", `#define CLOCK_PRESCALER ${flags.clockPrescaler}`], "Info");
    log(["client", "init", "flags", `#define OVERLAY_VERBOSE ${flags.overlayVerbose}`], "Info");
    initAssets();
    initSocket();
    initGl().catch(globalErrorHandler);

    const fURL = new URL(location.href);
    fURL.pathname = "/report-to"
    fetch(fURL).then(res => {
        if (res.ok) {
            res.text().then(cont => {
                const [serverURL, serverTarget] = splitcomma(cont);
                const reportURL = flags.reportServer ? new URL(flags.reportServer) : new URL(serverURL);
                const reportTarget = flags.reportTarget || serverTarget;
                logserver.start(reportURL, reportTarget);
            })
        }
    })
}
function hideInfos() {
    switch (flags.overlayVerbose) {
        case 0:
            $("#info").classList.add("hidden");
        case 1:
            $("#load-info").classList.add("hidden");
            break;
    }
}
function globalErrorHandler(err: any) {
    console.warn("Error");
    console.warn(err);
    if (err instanceof Error) {
        log(["error", `${err.name} ${err.message} ${err.stack || ""}`], "Error");
    }
    else if (typeof err == "string") {
        log(["error", err], "Error");
    }
    else if (err?.toString?.()) {
        log(["error", err.toString()], "Error");
    }
    else {
        console.warn("following error is not convertable into string:");
        console.error(err);
        log(["error", "cannot convert error to string"])
    }
}
function globalOnError(ev: any) {
    const err = ev as ErrorEvent | string;
    console.error(err);
    console.error("Error");
    if (typeof err == "string")
        log(["error", err], "Error");
    else
        log(["error", err.filename, `${err.message} ${err.lineno} ${err.colno}`], "Error")
}
window.onerror = globalOnError;
window.addEventListener("load", () => {
    try {
        init();
    } catch (err_) {
        const err = err_ as any;
        globalErrorHandler(err);
    }
});

let totalTextures = 0;
let loadingTextures = 0;
let textureLoadIndicatorEnabled = true;
function textureLoadIndicator(loaded: boolean) {
    if (loaded) {
        loadingTextures--;
    } else {
        totalTextures++;
        loadingTextures++;
    }
    if (textureLoadIndicatorEnabled) {
        if (loadingTextures) {
            // updateStatus(`loading textures (${totalTextures - loadingTextures}/${totalTextures} loaded)`)
            log_TODO_MIGRATE(`[assets] ${totalTextures - loadingTextures} loaded; ${totalTextures} total;${loadingTextures} remaining`)
            xdetail(["Assets", "Loader", "#detail", `${totalTextures - loadingTextures} loaded; ${totalTextures} total;${loadingTextures} remaining`], "Info")
        } else {
            // updateStatus("ready");
            // log(["Assets", "Loader", "loaded"])
            // $("#load-info").style.display = "none";
            // $("#info").style.display = "none";
        }
    }
}

let statusEl: HTMLElement;
function updateStatus(status: string, color: string = "default") {
    if (!statusEl) statusEl = $("#status-el");
    statusEl.innerText = status;
    // keep also old colors
    statusEl.classList.add("state-" + color);
}

let logEl: HTMLElement | null;
function log_TODO_MIGRATE(msg: string) {
    if (!logEl) logEl = document.getElementById("logs");
    if (logEl) {
        logEl.innerText += "\n" + msg;
    } else {
        console.log(msg);
    }
}
