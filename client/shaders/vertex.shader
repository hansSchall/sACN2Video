attribute vec2 a_objectPos;

attribute vec2 a_texturePos;

varying vec2 v_texturePos;

uniform lowp int u_mode;

vec4 convPos(vec2 pos) {
    return vec4((pos / .5 - 1.) * vec2(1., FLIP ? -1 : 1), 0, 1);
}

void main() {
    gl_Position = convPos(a_objectPos);
    v_texturePos = a_texturePos;
}