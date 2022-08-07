"use strict";
async function loadAssets(additional = []) {
    const uiEl = $("#files");
    uiEl.innerText = "indexing assets";
    log("[assets] indexing");
    const reqs = [
        ...(await (await fetch("/assets")).json()).filter(_ => (_.enabled ?? true)).map(_ => ({
            url: "/assets/" + _.id,
            id: _.id,
            label: _.label,
            mime: _.mime,
            size: _.size,
            objectURL: true,
        })),
        ...additional
    ];
    uiEl.innerText = "";
    loading += reqs.length;
    reqs.forEach(file => {
        const el = $el();
        log(`[assets] file = '${file.label}'
>> path = '${file.url}'
>> size = ${typeof file.size == "number" ? file.size + "bytes" : file.size}
>> mime = ${file.mime}) `);
        el.innerText = `'${file.label}': path='${file.url}'; size=${typeof file.size == "number" ? file.size + "bytes" : file.size}; mime=${file.mime})`;
        uiEl.appendChild(el);
        fetch(file.url).then(res => {
            if (res.ok) {
                log(`[t${timeSinceAppStart()}] [assets] [response] of '${file.label}'`);
                el.innerText += " [response]";
                console.log(`%c [${timeSinceAppStart()}] reponse ${file.id}`, "color: #0f0");
                function loaded() {
                    el.innerText += " [parsed]";
                    log(`[t${timeSinceAppStart()}] [assets] [data]     of '${file.label}'`);
                    el.classList.add("ok");
                    loading--;
                    checkLoadState();
                }
                if (file.objectURL) {
                    res.blob().then(_ => URL.createObjectURL(_)).then(_ => assets.set(file.id, _)).then(() => loaded()).catch(err => {
                        console.error("Response parsing failed");
                    });
                }
                else {
                    res.text().then(_ => assets.set(file.id, _)).then(() => loaded()).catch(err => {
                        console.error("Response parsing failed");
                    });
                }
            }
            else {
                el.innerText += " Failed";
                el.classList.add("failed");
                loading--;
                checkLoadState();
            }
        });
    });
    return new Promise(res => void (loaded = res));
}
let loaded;
let loading = 0;
function checkLoadState() {
    if (loading == 0) {
        console.log("%c loaded assets", "color: #0f0");
        loaded();
    }
}
const assets = new Map();
window.addEventListener("load", () => {
    const reqs = ["vertex", "fragment"].map(_ => ({
        url: `/client/shaders/${_}.shader`,
        id: `${_}.shader`,
        objectURL: false,
        label: `Shader ${_}`,
        size: "a few bytes",
        mime: "WebGL/shader"
    }));
    loadAssets([
        ...reqs
    ]).then(() => {
        shaderCode();
    });
});
let shaderCode;
function getShaderCode() {
    return new Promise(res => void (shaderCode = res));
}
//# sourceMappingURL=assets.js.map