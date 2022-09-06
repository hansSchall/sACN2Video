let glCtx: WebGL2RenderingContext | undefined;
let frameBufferSize = [window.screen.height, window.screen.width];

function setFBsize({ h, w }: { h?: number, w?: number }) {
    const gl = getGLcontext();
    if (h !== undefined) frameBufferSize[0] = h;
    if (w !== undefined) frameBufferSize[1] = w;
    gl.bindTexture(gl.TEXTURE_2D, lg.vcTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, frameBufferSize[1], frameBufferSize[0], 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
}

let renderTime: number[] = [];
let renderLoop = true;
let fps = 0;
let fpsEl: HTMLElement | undefined;

const fpsCyclesPerSecond = 2;

setInterval(() => {
    if (!fpsEl) return;

    fpsEl.innerText = `${fps * fpsCyclesPerSecond}fps (${Math.round(renderTime.reduce((prev, current) => prev + current, 0) / renderTime.length * 1000)}μs of ${Math.round(1000000 / (fps * fpsCyclesPerSecond))}μs)`;
    renderTime = [];
    fps = 0;
}, 1000 / fpsCyclesPerSecond);

async function initGl() {
    console.log(`%c [${timeSinceAppStart()}] starting init`, "color: #0ff");
    xdetail(["gl.ts", "init"]);
    fpsEl = $("#fps");

    const canvas = $<HTMLCanvasElement>("#c");

    if (!canvas) {
        throw new Error("canvas element not found");
    }

    glCtx = canvas.getContext("webgl2") || undefined;
    if (!glCtx) {
        log_TODO_MIGRATE("[FATAL ERROR] WebGL not supported");
        updateStatus("[ERROR] WebGL not supported", "error");
        log(["client", "gl.ts", "WebGL", "FatalError: WebGL not supported"], "Error");
        throw new Error("no WebGL");
    } else {
        xdetail("created WebGL context");
    }

    const gl = getGLcontext();

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    window.addEventListener("resize", () => gl && resizeCanvasToDisplaySize(canvas, gl));
    resizeCanvasToDisplaySize(canvas, gl)

    xdetail(["gl.ts", "shader", "loading"])
    await getShaderCode();
    const fragmentCode = "" + assets.get("fragment.shader");
    const vertexCode = "" + assets.get("vertex.shader");
    const program = compileShader(vertexCode, fragmentCode);
    gl.useProgram(program);

    xdetail(["gl.ts", "created shaders"]);
    xdetail(["gl.ts", "WebGL", "initializing", "uniforms, attributes, buffers, framebuffers and textures"])
    console.log(`%c [${timeSinceAppStart()}] √ created WebGL shaders`, "color: #0f0")
    updateStatus("initializing");
    [
        "u_srcTex",
        "u_vcTex",
        "u_trTex",
        "u_mode",
        "u_maskMode",
        "u_opacity",
        "u_cornerPinTr",
        "u_el_transform",
        "u_tex_transform",
        "u_cornerPinTr",
    ]
        .forEach(uname => uniforms.set(uname, undefinedMsg(gl?.getUniformLocation(program, uname), `failed to resolve uniform ${uname}`)));
    lg = {
        aCornerLoc: gl.getAttribLocation(program, "a_corner"),
        aCornerBuf: undefinedMsg(gl.createBuffer(), "buffer creation failed"),
        vcFb: undefinedMsg(gl.createFramebuffer(), "framebuffer creation failed"),
        vcTex: undefinedMsg(gl.createTexture(), "texture creation failed"),
        trFb: undefinedMsg(gl.createFramebuffer(), "framebuffer creation failed"),
        trTex: undefinedMsg(gl.createTexture(), "texture creation failed"),
        maskTex: undefinedMsg(gl.createTexture(), "texture creation failed"),
        pr: program
    }

    gl.bindTexture(gl.TEXTURE_2D, lg.vcTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, frameBufferSize[1], frameBufferSize[0], 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);


    /*
    * unit0: src
    * unit1: virtualCanvas
    * unit2: transform
    * 
     */

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, lg.maskTex);
    gl.uniform1i(getUniform("u_srcTex"), 0);


    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, lg.vcTex);
    gl.uniform1i(getUniform("u_vcTex"), 1);
    gl.bindFramebuffer(gl.FRAMEBUFFER, lg.vcFb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, lg.vcTex, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
        console.error("vcTex: this combination of attachments does not work");
        return;
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, lg.trTex);
    gl.uniform1i(getUniform("u_trTex"), 2);
    gl.bindFramebuffer(gl.FRAMEBUFFER, lg.trFb);
    gl.viewport(0, 0, frameBufferSize[1], frameBufferSize[0]);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, lg.trTex, 0);
    // if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
    //     console.error("trTex: this combination of attachments does not work");
    //     return;
    // }
    // gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    gl.uniform1i(getUniform("u_mode"), 0);
    gl.uniform1i(getUniform("u_maskMode"), 1);

    gl.bindBuffer(gl.ARRAY_BUFFER, lg.aCornerBuf);
    gl.vertexAttribPointer(lg.aCornerLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(lg.aCornerLoc);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1]), gl.DYNAMIC_DRAW);

    updateStatus("loading components")
    log(["gl.ts", "loading elements"])
    loadElmntsV2().then(() => {
        requestAnimationFrame(render);
        updateStatus("ready");
        hideInfos();
    }).catch(reportError);
}

let lg: {
    pr: WebGLProgram,
    aCornerLoc: number,
    aCornerBuf: WebGLBuffer,
    vcFb: WebGLFramebuffer,
    vcTex: WebGLTexture,
    trFb: WebGLFramebuffer,
    trTex: WebGLTexture,
    maskTex: WebGLTexture,

};

const uniforms = new Map<string, WebGLUniformLocation>();
let renderCycle = 0;
const clockPrescaler = flags.clockPrescaler;

let transformTextureBaseChanged = true;

function render() {
    renderCycle++;
    if (renderCycle < clockPrescaler) {
        window.requestAnimationFrame(render);
        return;
    } else {
        renderCycle = 0;
    }
    const startRender = performance.now();
    const gl = getGLcontext();
    resizeCanvasToDisplaySize(gl.canvas, gl);

    gl.bindFramebuffer(gl.FRAMEBUFFER, lg.vcFb);
    gl.viewport(0, 0, frameBufferSize[1], frameBufferSize[0]);
    gl.bindFramebuffer(gl.FRAMEBUFFER, lg.trFb);
    gl.viewport(0, 0, frameBufferSize[1], frameBufferSize[0]);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.bindFramebuffer(gl.FRAMEBUFFER, lg.vcFb);
    // gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(getUniform("u_mode"), 1);

    for (let el of elmnts) {
        const op = el.getOpacity();
        if (op == 0)
            continue;

        const [elTransform, texTransform] = el.getTransformMatrices();
        gl.uniformMatrix3fv(getUniform("u_el_transform"), false, elTransform || m3.empty())
        gl.uniformMatrix3fv(getUniform("u_tex_transform"), false, texTransform || m3.empty())
        gl.uniform1f(getUniform("u_opacity"), op);
        el.bindTex();
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    gl.uniform1f(getUniform("u_opacity"), 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, null);

    if (transformTextureBaseChanged) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, lg.trFb);
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.uniformMatrix3fv(getUniform("u_el_transform"), false, m3.empty());
        gl.uniformMatrix3fv(getUniform("u_tex_transform"), false, m3.empty());
        gl.uniformMatrix4x2fv(getUniform("u_cornerPinTr"), false, [
            0, 0, 1, 0, 1, 1, 0, 1
        ])
        gl.uniform1i(getUniform("u_mode"), 3);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        transformTextureBaseChanged = false;
    }

    // gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    // gl.activeTexture(gl.TEXTURE1);
    // gl.bindTexture(gl.TEXTURE_2D, lg.vcTex);
    // gl.activeTexture(gl.TEXTURE2);
    // gl.bindTexture(gl.TEXTURE_2D, lg.trTex);

    // gl.uniform1i(getUniform("u_mode"), 7);

    // gl.drawArrays(gl.TRIANGLES, 0, 6);

    renderTime.push(performance.now() - startRender);
    fps++;
    window.requestAnimationFrame(render);
}
