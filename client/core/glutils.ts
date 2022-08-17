function undefinedMsg<T>(fnVal: T | undefined | null, msg: string): T {
    if (!fnVal) {
        throw new Error(msg);
    } else {
        return fnVal;
    }
}

function getUniform(name: string) {
    return undefinedMsg(uniforms.get(name), `'${name}' was not resolved during lookup`)
}

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
    const shader = gl.createShader(type);
    if (!shader) {
        throw new Error("WebGL Shader creation failed");
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    } else {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        throw new Error("WebGL Shader creation failed");
    }
}

function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    const program = gl.createProgram();
    if (!program) {
        throw new Error("WebGL Program creation failed");
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

function compileShader(vertexCode: string, fragmentCode: string) {
    if (!gl) {
        throw new Error("WebGLContext is undefined");
    }
    const pr = createProgram(gl,
        createShader(gl, gl.VERTEX_SHADER, vertexCode),
        createShader(gl, gl.FRAGMENT_SHADER, fragmentCode));
    if (pr) {
        return pr;
    } else {
        throw new Error("WebGL Program creation failed");
    }
}

function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement, gl: WebGLRenderingContext) {
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    const needResize = canvas.width !== displayWidth ||
        canvas.height !== displayHeight;
    if (needResize) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    return needResize;
}

function vec2(x: number, y: number): vec2 {
    return [x, y];
}
type vec2 = [number, number];
type TransformProps = [vec2, vec2, vec2, vec2];
const transformProps: TransformProps = [
    vec2(0, 0),
    vec2(1, 0),
    vec2(0, 1),
    vec2(1, 1)
]

function int(val: string | number) {
    if (typeof val == "number") {
        return val;
    } else {
        return parseInt(val);
    }
}

type Pos = {
    x: number,
    y: number,
    h: number,
    w: number
}

function Pos2Buffer({ x, y, h, w }: Pos) {
    return new Float32Array([x, y, x + w, y, x + w, y + h, x, y, x, y + h, x + w, y + h]);
}