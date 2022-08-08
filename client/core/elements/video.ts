class VideoElmnt extends Elmnt {
    constructor(id: string, props: Prop[]) {
        super(id);
        if (!gl) {
            throw new Error("WebGLContext is undefined");
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);
        this.video = document.createElement("video");
        this.video.addEventListener('playing', () => {
            if (this.loaded) return;
            this.loaded = true;
            console.log(`%c [${timeSinceAppStart()}] mounted ${id}`, "color: #0f0");
            textureLoadIndicator(true);
        });
        this.video.src = assets.get(props.find(_ => _[0] == "src")?.[2] ?? "") ?? "";
        this.playback = new Playback(this.video, parseInt((props.find(_ => _[0] == "sync") ?? [])[2] ?? ""));
        textureLoadIndicator(false);
        props.forEach(this.initPar.bind(this));
    }
    playback: Playback;
    video: HTMLVideoElement;
    loaded: boolean = false;
    bindTex(bindPoint?: number): void {
        super.bindTex(bindPoint);
        if (!this.loaded) return;
        if (!gl) {
            throw new Error("WebGLContext is undefined");
        }
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.video);
    }
    updatePars(par: string, value: string | number, sacn?: boolean): void {
        switch (par) {
            case "pb":
            case "playback":
                this.playback.parsePBState(Math.round(parseFloat(value as string) * 255));
                break;
            default:
                super.updatePars(par, value, sacn);
        }
    }
}