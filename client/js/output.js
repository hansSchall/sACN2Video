"use strict";
function timeSinceAppStart() {
    return Date.now() - firstScriptTimestamp + "ms";
}
function init() {
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
let textureLoadIndicatorEnabled = false;
function textureLoadIndicator(loaded) {
    if (loaded) {
        loadingTextures--;
    }
    else {
        totalTextures++;
        loadingTextures++;
    }
    if (textureLoadIndicatorEnabled) {
        if (loadingTextures) {
            updateStatus(`loading textures (${totalTextures - loadingTextures}/${totalTextures} loaded)`);
        }
        else {
            updateStatus("ready");
            // $("#load-info").style.display = "none";
            // $("#info").style.display = "none";
        }
    }
}
let statusEl;
function updateStatus(status, color = "default") {
    if (!statusEl)
        statusEl = $("#status-el");
    statusEl.innerText = status;
    // keep also old colors
    statusEl.classList.add("state-" + color);
}
//# sourceMappingURL=output.js.map