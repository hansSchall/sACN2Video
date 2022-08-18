class ImgElmnt extends Elmnt {
    constructor(id: string, props: Prop[]) {
        super(id);
        const gl = getGLcontext();
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);
        const img = new Image();
        img.src = assets.get(props.find(_ => _[0] == "src")?.[2] ?? "") ?? "";
        textureLoadIndicator(false);
        img.addEventListener('load', () => {
            if (!gl) {
                throw new Error("WebGLContext is undefined");
            }
            // Now that the image has loaded make copy it to the texture.
            gl.bindTexture(gl.TEXTURE_2D, this.tex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

            console.log(`%c [${timeSinceAppStart()}] mounted ${id}`, "color: #0f0");
            textureLoadIndicator(true);
        });
        props.forEach(this.initPar.bind(this));
    }


}