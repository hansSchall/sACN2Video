class EffectElmnt extends Elmnt {
    constructor(id: string, props: Prop[]) {
        super(id);
        function getStaticIntPar(par: string) {
            return parseInt(props.find(_ => _[0] == par)?.[2] ?? "1") || 1;
        }
        props.forEach(this.initPar.bind(this));
        const gl = getGLcontext();
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        this.pixelmap = new Pixelmap(getStaticIntPar("start"), getStaticIntPar("height"), getStaticIntPar("width"));
    }
    private overscan: boolean = true;
    private pixelmap: Pixelmap;
    bindTex(bindPoint?: number): void {
        super.bindTex(bindPoint);
        const gl = getGLcontext();
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.pixelmap.width, this.pixelmap.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.pixelmap.buffer);
    }
    getTransformMatrices(): [number[] | null, number[] | null] {
        if (this.overscan)
            return [m3.empty(), m3.scaling(1 / this.pixelmap.width, 1 / this.pixelmap.height)];
        else
            return [m3.empty(), m3.empty()];
    }
}
