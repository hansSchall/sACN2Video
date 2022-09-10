function rootElement(props: any[]) {
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
                img.src = getAsset(value.toString()) ?? "";
                useMask = true;
                img.addEventListener("load", () => {
                    const gl = getGLcontext();
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
