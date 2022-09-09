class Pixelmap {
    constructor(readonly start: number, readonly height: number, readonly width: number) {
        for (let i = 0; i < this.dataSize; i++) {
            addSacnListener(start + i, (val) => this.buffer[i] = val);
        }
    }
    readonly pixSize: number = this.height * this.width;
    readonly dataSize: number = this.pixSize * 4;
    readonly buffer = new Uint8Array(this.height * this.width * 4);
}
