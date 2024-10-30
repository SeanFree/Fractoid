precision highp float;
precision mediump int;

uniform float uScaleBase;
uniform float uScaleRange;

attribute vec3 aPosition;

varying vec2 vPos;
varying float vScale;

float norm(float n, float min, float max) {
    return (n - min) / (max - min);
}

float getScale() {
    return 1.5 - (uScaleBase + norm(uScaleRange, uScaleBase, 2.));
}

void main() {
    vScale = getScale();
    vPos = (gl_Position = vec4(aPosition, 1.)).xy;
}
