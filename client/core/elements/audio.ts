class AudioElmnt extends Elmnt {
    constructor(id: string, props: Prop[]) {
        super(id);
        this.audio = document.createElement("video");
        this.audio.addEventListener('playing', () => {
            if (this.loaded) return;
            this.loaded = true;
            console.log(`%c [${timeSinceAppStart()}] mounted ${id}`, "color: #0f0");
            textureLoadIndicator(true);
        });
        this.audio.src = assets.get(props.find(_ => _[0] == "src")?.[2] ?? "") ?? "";
        this.playback = new Playback(this.audio, parseInt(props.find(_ => _[0] == "sync")?.[2] ?? ""));
        textureLoadIndicator(false);
        props.forEach(this.initPar.bind(this));
    }
    playback: Playback;
    audio: HTMLVideoElement;
    loaded: boolean = false;
    bindTex(bindPoint?: number): void {
        super.bindTex(bindPoint);
        if (!this.loaded) return;
        const gl = getGLcontext();
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.audio);
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
    getOpacity(): number {
        return 0;
    }
}