function tranformCorner(corner: "TL" | "TR" | "BL" | "BR" | string) {
    switch (corner) {
        case "TL":
            return 0;
        case "TR":
            return 1;
        case "BL":
            return 2;
        case "BR":
            return 3;
        default:
            return null;
    }
}
let useMask = false;
const rootLock = false;
async function loadElmnts() {
    let config: unknown = await (await fetch("/config")).json();
    console.log(config);
    if (!Array.isArray(config)) {
        throw new Error(`gl.ts loadElmnts(): config is not an array`);
    }
    for (let el of config as unknown[]) {
        if (!Array.isArray(el)) {
            throw new Error(`gl.ts loadElmnts(): config[...] is not an array`);
        }
        const id: string | unknown = el[0];
        const props: Prop[] | unknown = el[2];
        if (typeof id != "string") {
            throw new Error(`gl.ts loadElmnts(): config[...][0] is not a string`);
        }
        if (typeof el[1] != "string") {
            throw new Error(`gl.ts loadElmnts(): config[...][1] is not a string`);
        }
        if (!Array.isArray(props)) {
            throw new Error(`gl.ts loadElmnts(): config[...][2] is not an array`);
        }
        switch (el[1] as string) {
            case "img":
                elmnts.add(new ImgElmnt(id, props));
                break;
            case "video":
                elmnts.add(new VideoElmnt(id, props));
                break;
            case "root":
                if (rootLock) {
                    console.error(`found more than one root config`);
                } else {
                    const updateParImpl = {
                        updatePars(par: string, value: string | number, sacn?: boolean): void {
                            const corner = par.slice(0, 2);
                            const coord = par.slice(2);
                            if (/^(T|B)(L|R)(X|Y)$/.test(par) && corner.length == 2 && coord.length == 1) {
                                transformProps
                                [tranformCorner(corner) ?? 0]
                                [coord == "X" ? 0 : 1] =
                                    parseFloat(value as string);
                            } else if (par == "mask") {
                                textureLoadIndicator(false);
                                const img = new Image();
                                img.src = assets.get(value.toString()) ?? "";
                                useMask = true;
                                img.addEventListener("load", () => {
                                    if (!gl) {
                                        throw new Error("WebGLContext is undefined");
                                    }
                                    gl.bindTexture(gl.TEXTURE_2D, lg.maskTex);
                                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
                                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                                    console.log(`%c [${timeSinceAppStart()}] mounted mask`, "color: #0f0");
                                    textureLoadIndicator(true);
                                })
                            } else if (par == "fbH") {
                                setFBsize({
                                    h: int(value)
                                })
                            } else if (par == "fbW") {
                                setFBsize({
                                    w: int(value)
                                })
                            }
                        }
                    }
                    props.forEach(Elmnt.prototype.initPar.bind(updateParImpl));
                }
                break;
        }
    }
    clear();
}