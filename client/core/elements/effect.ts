class EffectElmnt extends Elmnt {
    constructor(id: string, props: Prop[]) {
        super(id);
        props.forEach(this.initPar.bind(this));
        const gl = getGLcontext();
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        this.setTexData(2, 2, [
            255, 0, 0, 255,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 255, 0, 255,
            // 0, 255, 255, 255,
            // 0, 255, 255, 255,
            // 255, 255, 0, 255,
            // 0, 0, 255, 255,
            // 0, 255, 255, 255,
            // 255, 255, 255, 255,

        ]);
    }
    private texWidth: number = 1;
    private texHeight: number = 1;
    private texData = new Uint8Array([0, 0, 0, 0]);
    setTexData(h: number, w: number, data: Uint8Array | Array<number>) {
        if (h * w * 4 == data.length) {
            this.texWidth = w;
            this.texHeight = h;
            if (data instanceof Uint8Array)
                this.texData = data;
            else
                this.texData = new Uint8Array(data);

            const gl = getGLcontext();
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.texData);
        } else {
            throw new Error("data.length != h * w * 4 (Format RGBA)");
        }
    }
    getTransformMatrices(): [number[] | null, number[] | null] {
        // return [m3.empty(), m3.empty()];
        return [m3.empty(), m3.scaling(1 / this.texWidth, 1 / this.texHeight)];
    }
}