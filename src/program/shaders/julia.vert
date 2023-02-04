precision highp float;
precision mediump int;

uniform int uRotateScene;
uniform vec2 uC;
uniform int uCChannel;
uniform int uRotateC;
uniform int uTimeUpdateC;
uniform float uCRotateRange;

uniform int uHueChannel;
uniform float uHueBase;
uniform float uHueRange;

uniform int uSaturationChannel;
uniform float uSaturationBase;
uniform float uSaturationRange;

uniform int uLightnessChannel;
uniform float uLightnessBase;
uniform float uLightnessRange;

uniform int uGlow;
uniform int uGlowChannel;
uniform float uGlowIntensity;

uniform int uScaleEnabled;
uniform int uScaleChannel;
uniform float uScaleBase;
uniform float uScaleRange;

uniform int uSmoothShading;
uniform float uTime;
uniform float uSubBass;
uniform float uBass;
uniform float uLowMid;
uniform float uMid;
uniform float uHighMid;
uniform float uPresence;
uniform float uBrilliance;
uniform float uFreqAvg;

attribute vec3 aPosition;

varying vec2 vPos;
varying float vScale;
varying float vSaturation;
varying float vLightness;

float getChannelValue(int channel) {
    float value;

    if (channel == 0) {
        value = uSubBass;
    } else if (channel == 1) {
        value = uBass;
    } else if (channel == 2) {
        value = uLowMid;
    } else if (channel == 3) {
        value = uMid;
    } else if (channel == 4) {
        value = uHighMid;
    } else if (channel == 5) {
        value = uPresence;
    } else if (channel == 6) {
        value = uBrilliance;
    }

    return value;
}

float norm(float n, float min, float max) {
    return (n - min) / (max - min);
}

float getScale() {
    // float scale = getChannelValue(uScaleChannel);

    return 1.5 - (uScaleBase + norm(uScaleRange, uScaleBase, 2.));
}

float getSaturation() {
    // float saturation = getChannelValue(uSaturationChannel);

    return uSaturationBase + norm(uSaturationRange, uSaturationBase, 2.);
}

float getLightness() {
    // float lightness = getChannelValue(uLightnessChannel);

    return uLightnessBase + norm(uLightnessRange, uLightnessBase, 2.);
}

void main() {
    vScale = getScale();
    vSaturation = getSaturation();
    vLightness = getLightness();
    vPos = (gl_Position = vec4(aPosition, 1.)).xy;
}
