#version 300 es
precision lowp float;
precision lowp int;

in vec2 v_texturePos;

out vec4 outColor;

uniform sampler2D u_srcTex;
uniform sampler2D u_vcTex;
uniform sampler2D u_trTex;

uniform lowp int u_mode;

uniform float u_opacity;
uniform lowp int u_maskMode;

uniform mat4x2 u_cornerPinTr;

// taken from https://iquilezles.org/articles/ibilinear/

float cross2d(in vec2 a, in vec2 b) { return a.x * b.y - a.y * b.x; }

vec2 transform3D(in vec2 p, in vec2 a, in vec2 b, in vec2 c, in vec2 d)
{
    vec2 res = vec2(-1.0);

    vec2 e = b - a;
    vec2 f = d - a;
    vec2 g = a - b + c - d;
    vec2 h = p - a;

    float k2 = cross2d(g, f);
    float k1 = cross2d(e, f) + cross2d(h, g);
    float k0 = cross2d(h, e);

    // if edges are parallel, this is a linear equation
    if (abs(k2) < 0.001)
    {
        res = vec2((h.x * k1 + f.x * k0) / (e.x * k1 - g.x * k0), -k0 / k1);
    }
    // otherwise, it's a quadratic
    else
    {
        float w = k1 * k1 - 4.0 * k0 * k2;
        if (w < 0.0) return vec2(-1.0);
        w = sqrt(w);

        float ik2 = 0.5 / k2;
        float v = (-k1 - w) * ik2;
        float u = (h.x - f.x * v) / (e.x + g.x * v);

        if (u < 0.0 || u>1.0 || v < 0.0 || v>1.0)
        {
            v = (-k1 + w) * ik2;
            u = (h.x - f.x * v) / (e.x + g.x * v);
        }
        res = vec2(u, v);
    }

    return res;
}

vec2 short3Dtransform(vec2 pos, mat4x2 tr) {
    return transform3D(pos, tr[0], tr[1], tr[2], tr[3]);
}

bool outOf01Range(vec2 pos) {
    if (pos.x < 0. || pos.x > 1. || pos.y < 0. || pos.y > 1.) {
        return true;
    } else {
        return false;
    }
}

// 0 to 1 > -1 to 1
vec2 toClipspace(vec2 pos) {
    return (pos * 2. - 1.);
}
// -1 to 1 > 0 to 1
vec2 toTexture(vec2 pos) {
    return ((pos + 1.) / 2.);
}

vec2 verticalFlip(vec2 pos) {
    return vec2(pos.x, pos.y * -1. + 1.);
}

vec4 getTex(vec2 pos, sampler2D tex) {
    vec2 texPix = toTexture(pos * vec2(1, -1));
    if (outOf01Range(texPix)) {
        return vec4(0, 0, 1, 1); //transparent
    } else {
        return texture(tex, texPix);
        // outColor = vec4(texPix, 0, 1); //transparent
    }
}


void main() {
    if (u_mode == 1) { // 1:1 copy
        vec2 texPix = toTexture(v_texturePos);
        outColor = texture(u_srcTex, texPix);
        outColor.a *= u_opacity;
        if (outOf01Range(v_texturePos)) {
            outColor = vec4(0, 0, 0, 0); //transparent
        }
    } else if (u_mode == 2) {
        vec2 texPix = short3Dtransform(v_texturePos, u_cornerPinTr);
        if (outOf01Range(texPix)) {
            outColor = vec4(0, 0, 0, 0); //transparent
        } else {
            outColor = texture(u_vcTex, texPix);
            float alpha = 1.;
            //maskMode == 0 //disable mask
            if (u_maskMode == 1) { //red
                alpha = texture(u_trTex, v_texturePos).r;
            } else if (u_maskMode == 2) { //green
                alpha = texture(u_trTex, v_texturePos).g;
            } else if (u_maskMode == 3) { //blue
                alpha = texture(u_trTex, v_texturePos).b;
            } else if (u_maskMode == 4) { //alpha
                alpha = texture(u_trTex, v_texturePos).a;
            }
#ifdef MASK_STAIRS
            outColor.a = alpha > .5 ? 1. : 0.;
#else
            outColor.a = alpha;
#endif
        }
    } else if (u_mode == 3) {  // transformTexture
        vec2 texPix = transform3D(toTexture(v_texturePos), u_cornerPinTr[0], u_cornerPinTr[1], u_cornerPinTr[2], u_cornerPinTr[3]);
        // vec2 texPix = transform3D(v_texturePos, vec2(.1, 0), vec2(1, 0), vec2(1, 1), vec2(.2, 1));

        if (outOf01Range(texPix)) {
            outColor = vec4(0, 0, 1, 1); //transparent
        } else {
            // outColor = texture(u_srcTex, verticalFlip(texPix));
            // outColor = texture(u_srcTex, (texPix));
            outColor = vec4(texPix, 0, 1);
        }
        // outColor = getTex(texPix, u_srcTex);
    } else if (u_mode == 4) {  // 1:1 transformTexture
        outColor = vec4(v_texturePos, 0, 1);
    } else if (u_mode == 7) {  // use transformTexture

        vec4 readTrTexData = texture(u_trTex, v_texturePos);
        outColor = texture(u_vcTex, verticalFlip(readTrTexData.xy));
        // outColor.a *= readTrTexData.b; // alpha is stored in blue channel
        outColor = readTrTexData;
    }
}
