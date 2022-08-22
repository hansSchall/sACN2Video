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
                    rootElement(props)
                }
                break;
        }
    }
    clear();
}

async function loadElmntsV2() {
    const config = splitcomma(await (await fetch("/config/v2")).text());
    for (let el_ of config) {
        const el = splitcomma(el_);
        const id: string | unknown = el[0];
        if (typeof id != "string") {
            throw new Error(`gl.ts loadElmnts(): config[...][0] is not a string`);
        }
        if (typeof el[1] != "string") {
            throw new Error(`gl.ts loadElmnts(): config[...][1] is not a string`);
        }
        const props: Prop[] = splitcomma(el[2]).map(_ => splitcomma(_)) as any[];
        if (props.findIndex(_ => _.length != 3 && _.length != 5) != -1)
            throw new Error("gl.ts loadElmnts(): property descriptor has no matching length");
        switch (el[1] as string) {
            case "img":
                elmnts.add(new ImgElmnt(id, props));
                break;
            case "video":
                elmnts.add(new VideoElmnt(id, props));
                break;
            case "audio":
                elmnts.add(new AudioElmnt(id, props));
                break;
            case "effect":
                elmnts.add(new EffectElmnt(id, props));
                break;
            case "root":
                if (rootLock) {
                    console.error(`found more than one root config`);
                } else {
                    rootElement(props)
                }
                break;
        }
    }
    clear();
}


type Prop = [string, string, string] | [string, string, string, string, string];

const elmnts = new Set<Elmnt>();
abstract class Elmnt {
    constructor(readonly id: string) {
        const gl = getGLcontext();
        this.tex = undefinedMsg(gl.createTexture(), "texture creation failed");
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    }
    protected tex: WebGLTexture;
    getOpacity() {
        return this.opacity;
    }
    protected opacity: number = 0;
    bindTex(bindPoint: number = glCtx?.TEXTURE_2D || 0) {
        const gl = getGLcontext();
        gl.bindTexture(bindPoint, this.tex);
    }
    bufferPos() {
        const gl = getGLcontext();
        gl.bufferData(gl.ARRAY_BUFFER, Pos2Buffer(this.pos), gl.DYNAMIC_DRAW);
    }
    pos: Pos = { x: 0, y: 0, h: 1, w: 1 };
    updatePars(par: string, value: string | number, sacn?: boolean): void {
        switch (par) {
            case "intens":
            case "i":
            case "o":
            case "intensity":
                this.opacity = parseFloat(value as string);
                break;
            case "x":
                this.pos.x = parseFloat(value as string);
                break;
            case "y":
                this.pos.y = parseFloat(value as string);
                break;
            case "h":
                this.pos.h = parseFloat(value as string);
                break;
            case "w":
                this.pos.w = parseFloat(value as string);
                break;
        }
    }
    initPar([name, type, value, input = "", output = ""]: Prop) {
        type = type.toLowerCase();
        function addSacnListener(addr: number, listener: (this: Elmnt, value: number) => void) {
            if (sacnListener.has(addr)) {
                sacnListener.get(addr)?.add(listener);
            } else {
                sacnListener.set(addr, new Set([listener]));
            }
        }

        const updateValue = (value: number | string, dyn: boolean = false) => {
            this.updatePars(name, (valueMapping || (_ => _))(value), dyn);
        }

        let valueMapping: ((val: string | number) => string | number) | undefined;

        if (input && output) {
            valueMapping = createValueMapping(input, output);
        }

        if (type.startsWith("static")) {
            if (type == "staticcp") {
                if (!valueMapping) valueMapping = val => (parseFloat(val as string) + 1) / 2
                // this.updatePars(name, (parseFloat(value) + 1) / 2, false);
            } else if (type == "staticpcp") {
                if (!valueMapping) valueMapping = val => (parseFloat(val as string) + 100) / 200
                // this.updatePars(name, (parseFloat(value) + 100) / 200, false);
            } else {
                // this.updatePars(name, value, false);
            }
        } else if (type == "sacn") {
            const rawaddr = value.split(/(\/|\+|\,|\.|\\)/).map(_ => parseInt(_)).filter(_ => !isNaN(_));
            let addr: number | [number, number]
            if (rawaddr.length == 1) { // addr
                addr = rawaddr[0];
            } else if (rawaddr.length == 2) { // universe/addr
                addr = (rawaddr[0] - 1) * 512 + rawaddr[1];
            } else if (rawaddr.length == 3) { // universe/low/high
                addr = [((rawaddr[0] - 1) * 512 + rawaddr[1]), ((rawaddr[0] - 1) * 512 + rawaddr[2])];
            } else if (rawaddr.length == 4) { // universelow/low/universehigh/high
                addr = [((rawaddr[0] - 1) * 512 + rawaddr[1]), ((rawaddr[2] - 1) * 512 + rawaddr[3])];
            } else {
                throw new Error("sacn value.length is not in the range of 1-4");
            }

            if (typeof addr == "number") { // 8
                addSacnListener(addr, value => {
                    if (!valueMapping)
                        valueMapping = val => (+val / 255);
                    updateValue(value, true);
                });
            } else { // 16
                let valuelow = 0, valuehi = 0;
                const compute16bValue = (() => {
                    if (!valueMapping)
                        valueMapping = val => (+val / 65535);
                    updateValue(((valuehi << 8) + valuelow), true);
                }).bind(this);
                addSacnListener(addr[0], value => {
                    valuelow = value;
                    compute16bValue();
                });
                addSacnListener(addr[1], value => {
                    valuehi = value;
                    compute16bValue();
                });
            }
        } else {
            console.warn(`type of ${this.id}.${name} is unknown`);
        }
    }
}