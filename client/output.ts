function timeSinceAppStart() {
    return Date.now() - firstScriptTimestamp + "ms";
}
function init() {
    log_TODO_MIGRATE("[client] starting")
    initSocket();
    initGl();
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
window.addEventListener("load", init);

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
        } else {
            // updateStatus("ready");
            log_TODO_MIGRATE(`[assets] loaded`);
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