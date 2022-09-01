#version 300 es

in vec2 a_corner;

out vec2 v_texturePos;

uniform lowp int u_mode;

uniform mat3 u_el_transform;

uniform mat3 u_tex_transform;

// 0 to 1 > -1 to 1
vec2 toClipspace(vec2 pos) {
    return (pos * 2. - 1.);
}
// -1 to 1 > 0 to 1
vec2 toTexture(vec2 pos) {
    return ((pos + 1.) / 2.);
}

void main() {
    gl_Position = vec4((u_el_transform * vec3(toClipspace(a_corner), 1)).xy, 0, 1);
    v_texturePos = ((u_tex_transform * vec3(toClipspace(a_corner), 1.)).xy);
}
