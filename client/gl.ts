// let glCtx: WebGLRenderingContext | undefined;
// let frameBufferSize = [window.screen.height, window.screen.width];

// function setFBsize({ h, w }: { h?: number, w?: number }) {
//     const gl = getGLcontext();
//     if (h !== undefined) frameBufferSize[0] = h;
//     if (w !== undefined) frameBufferSize[1] = w;
//     gl.bindTexture(gl.TEXTURE_2D, lg.fbTex);
//     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, frameBufferSize[1], frameBufferSize[0], 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
// }

// let renderTime: number[] = [];
// let renderLoop = true;
// let fps = 0;
// let fpsEl: HTMLElement | undefined;

// const fpsCyclesPerSecond = 2;

// setInterval(() => {
//     if (!fpsEl) return;

//     fpsEl.innerText = `${fps * fpsCyclesPerSecond}fps (${Math.round(renderTime.reduce((prev, current) => prev + current, 0) / renderTime.length * 1000)}μs of ${Math.round(1000000 / (fps * fpsCyclesPerSecond))}μs)`;
//     renderTime = [];
//     fps = 0;
// }, 1000 / fpsCyclesPerSecond);

// async function initGl() {
//     console.log(`%c [${timeSinceAppStart()}] starting init`, "color: #0ff");
//     xdetail(["gl.ts", "init"]);
//     fpsEl = $("#fps");

//     const canvas = $<HTMLCanvasElement>("#c");

//     if (!canvas) {
//         throw new Error("canvas element not found");
//     }

//     glCtx = canvas.getContext("webgl2") || undefined;
//     if (!glCtx) {
//         log_TODO_MIGRATE("[FATAL ERROR] WebGL not supported");
//         updateStatus("[ERROR] WebGL not supported", "error");
//         log(["client", "gl.ts", "WebGL", "FatalError: WebGL not supported"], "Error");
//         throw new Error("no WebGL");
//     } else {
//         xdetail("created WebGL context");
//     }

//     const gl = getGLcontext();

//     gl.enable(gl.BLEND);
//     gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

//     window.addEventListener("resize", () => gl && resizeCanvasToDisplaySize(canvas, gl));
//     resizeCanvasToDisplaySize(canvas, gl)

//     xdetail(["gl.ts", "shader", "loading"])
//     await getShaderCode();
//     const fragmentCode = [
//         "precision lowp float;",
//         "precision lowp int;",
//         flags.transform ? "#define ENABLE_TRANSFORM" : "// TRANSFORM DISABLED"
//     ].join("\n") + "\n\n" + assets.get("fragment.shader");
//     const vertexCode = [
//         flags.transform ? "#define FLIP (u_mode == 2)" : "#define FLIP true"
//     ].join("\n") + "\n\n" + assets.get("vertex.shader");
//     const program = compileShader(vertexCode, fragmentCode);
//     gl.useProgram(program);

//     xdetail(["gl.ts", "created shaders"]);
//     xdetail(["gl.ts", "WebGL", "initializing", "uniforms, attributes, buffers, framebuffers and textures"])
//     console.log(`%c [${timeSinceAppStart()}] √ created WebGL shaders`, "color: #0f0")
//     updateStatus("initializing");
//     [
//         "u_texture",
//         "u_fbTex",
//         "u_mask",
//         "u_mode",
//         "u_maskMode",
//         "u_opacity",
//         "u_eTL",
//         "u_eTR",
//         "u_eBL",
//         "u_eBR",
//         "u_el_transform",
//         "u_tex_transform",
//     ]
//         .forEach(uname => uniforms.set(uname, undefinedMsg(gl?.getUniformLocation(program, uname), `failed to resolve uniform ${uname}`)));
//     lg = {
//         aCornerLoc: gl.getAttribLocation(program, "a_corner"),
//         aCornerBuf: undefinedMsg(gl.createBuffer(), "buffer creation failed"),
//         fb: undefinedMsg(gl.createFramebuffer(), "framebuffer creation failed"),
//         fbTex: undefinedMsg(gl.createTexture(), "texture creation failed"),
//         maskTex: undefinedMsg(gl.createTexture(), "texture creation failed"),
//         pr: program
//     }

//     gl.bindTexture(gl.TEXTURE_2D, lg.fbTex);
//     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, frameBufferSize[1], frameBufferSize[0], 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);


//     /*
//     * unit0: el tex
//    * unit1: virtualCanvas
//    * unit2: mask
//      */

//     gl.activeTexture(gl.TEXTURE0);
//     gl.bindTexture(gl.TEXTURE_2D, lg.maskTex);
//     gl.uniform1i(getUniform("u_texture"), 0);


//     gl.activeTexture(gl.TEXTURE1);
//     gl.bindTexture(gl.TEXTURE_2D, lg.fbTex);
//     gl.uniform1i(getUniform("u_fbTex"), 1);

//     gl.bindFramebuffer(gl.FRAMEBUFFER, lg.fb);
//     gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, lg.fbTex, 0);
//     gl.bindFramebuffer(gl.FRAMEBUFFER, null);

//     gl.activeTexture(gl.TEXTURE2);
//     gl.bindTexture(gl.TEXTURE_2D, lg.maskTex);
//     gl.uniform1i(getUniform("u_mask"), 2);

//     gl.activeTexture(gl.TEXTURE1);

//     gl.uniform1i(getUniform("u_mode"), 0);
//     gl.uniform1i(getUniform("u_maskMode"), 1);
//     gl.uniform2f(getUniform("u_eTL"), 0, 0);
//     gl.uniform2f(getUniform("u_eTR"), 1, 0);
//     gl.uniform2f(getUniform("u_eBL"), 0, 1);
//     gl.uniform2f(getUniform("u_eBR"), 1, 1);

//     gl.bindBuffer(gl.ARRAY_BUFFER, lg.aCornerBuf);
//     gl.vertexAttribPointer(lg.aCornerLoc, 2, gl.FLOAT, false, 0, 0);
//     gl.enableVertexAttribArray(lg.aCornerLoc);
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1]), gl.DYNAMIC_DRAW);

//     updateStatus("loading components")
//     log(["gl.ts", "loading elements"])
//     loadElmntsV2().then(() => {
//         requestAnimationFrame(render_old);
//         updateStatus("ready");
//         hideInfos();
//     }).catch(reportError);
// }

// let lg: {
//     pr: WebGLProgram,
//     aCornerLoc: number,
//     aCornerBuf: WebGLBuffer,
//     fb: WebGLFramebuffer,
//     fbTex: WebGLTexture,
//     maskTex: WebGLTexture,

// };

// const uniforms = new Map<string, WebGLUniformLocation>();
// let renderCycle = 0;
// const clockPrescaler = flags.clockPrescaler;

function updateTransform(transformProps: TransformProps) {
    const gl = getGLcontext();
    gl.uniform2f(getUniform("u_eTL"), ...transformProps[0]);
    gl.uniform2f(getUniform("u_eTR"), ...transformProps[1]);
    gl.uniform2f(getUniform("u_eBL"), ...transformProps[2]);
    gl.uniform2f(getUniform("u_eBR"), ...transformProps[3]);
}

function render_old() {
    renderCycle++;
    if (renderCycle < clockPrescaler) {
        window.requestAnimationFrame(render_old);
        return;
    } else {
        renderCycle = 0;
    }
    const startRender = performance.now();
    const gl = getGLcontext();
    resizeCanvasToDisplaySize(gl.canvas, gl);
    updateTransform(transformProps);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.activeTexture(gl.TEXTURE0);
    if (flags.transform) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, lg.vcFb);
        gl.viewport(0, 0, frameBufferSize[1], frameBufferSize[0]);
        gl.bindFramebuffer(gl.FRAMEBUFFER, lg.trFb);
        gl.viewport(0, 0, frameBufferSize[1], frameBufferSize[0]);
    } else {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform1i(getUniform("u_mode"), 1);
    // gl.bindBuffer(gl.ARRAY_BUFFER, lg.aCornerBuf);
    for (let el of elmnts) {
        const op = el.getOpacity();
        if (op == 0) continue;
        const [elTransform, texTransform] = el.getTransformMatrices();
        gl.uniformMatrix3fv(getUniform("u_el_transform"), false, elTransform || m3.empty())
        gl.uniformMatrix3fv(getUniform("u_tex_transform"), false, texTransform || m3.empty())
        gl.uniform1f(getUniform("u_opacity"), op);
        // el.bufferPos();
        el.bindTex();
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    if (flags.transform) {
        gl.uniform1i(getUniform("u_maskMode"), useMask ? 1 : 0);
        gl.uniformMatrix3fv(getUniform("u_el_transform"), false, m3.empty())
        gl.uniformMatrix3fv(getUniform("u_tex_transform"), false, m3.empty())
        // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1]), gl.DYNAMIC_DRAW);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, lg.vcTex);
        gl.uniform1i(getUniform("u_mode"), 3);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    renderTime.push(performance.now() - startRender);
    fps++;
    window.requestAnimationFrame(render_old);
}
