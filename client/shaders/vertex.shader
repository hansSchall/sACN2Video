attribute vec2 a_objectPos;

attribute vec2 a_texturePos;

varying vec2 v_texturePos;

uniform lowp int u_mode;

uniform mat3 u_el_transform;

uniform mat3 u_tex_transform;

// 0 to 1 > -1 to 1
vec2 convPos(vec2 pos) {
    return (pos * 2. - 1.);
}
// -1 to 1 > 0 to 1
vec2 convBack(vec2 pos) {
    return ((pos + 1.) / 2.);
}

void main() {
    gl_Position = vec4(
        (u_el_transform * vec3(convPos(a_objectPos), 1)).xy
        , 0, 1);
    // gl_Position = ;
    v_texturePos = convBack((u_tex_transform * vec3(convPos(a_texturePos), 1.)).xy * vec2(1., FLIP ? -1 : 1));
    // v_texturePos = ((u_tex_transform * vec3((a_texturePos), 1)).xy);
}