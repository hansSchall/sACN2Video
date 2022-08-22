varying vec2 v_texturePos;

uniform sampler2D u_texture;
uniform lowp int u_mode;
uniform float u_opacity;

#ifdef ENABLE_TRANSFORM

uniform sampler2D u_mask;
uniform lowp int u_maskMode;
uniform sampler2D u_fbTex;
uniform vec2 u_eTL;
uniform vec2 u_eTR;
uniform vec2 u_eBL;
uniform vec2 u_eBR;

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
#endif

bool outOf01Range(vec2 pos) {
    if (pos.x < 0. || pos.x > 1. || pos.y < 0. || pos.y > 1.) {
        return true;
    } else {
        return false;
    }
}

void main() {
    if (u_mode == 1) { // 1:1 copy
        gl_FragColor = texture2D(u_texture, v_texturePos);
        gl_FragColor.a *= u_opacity;
        if (outOf01Range(v_texturePos)) {
            gl_FragColor = vec4(0, 0, 0, 0); //transparent
        }
    }
#ifdef ENABLE_TRANSFORM
    else if (u_mode == 2) {
        vec2 texPix = transform3D(v_texturePos, u_eTL, u_eTR, u_eBR, u_eBL);
        if (outOf01Range(texPix)) {
            gl_FragColor = vec4(0, 0, 0, 0); //transparent
        } else {
            gl_FragColor = texture2D(u_fbTex, texPix);
            float alpha = 1.;
            //maskMode == 0 //disable mask
            if (u_maskMode == 1) { //red
                alpha = texture2D(u_mask, v_texturePos).r;
            } else if (u_maskMode == 2) { //green
                alpha = texture2D(u_mask, v_texturePos).g;
            } else if (u_maskMode == 3) { //blue
                alpha = texture2D(u_mask, v_texturePos).b;
            } else if (u_maskMode == 4) { //alpha
                alpha = texture2D(u_mask, v_texturePos).a;
            }
#ifdef MASK_STAIRS
            gl_FragColor.a = alpha > .5 ? 1. : 0.;
#else
            gl_FragColor.a = alpha;
#endif
        }
    }
#endif
}