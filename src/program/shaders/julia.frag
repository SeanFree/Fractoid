#define TAU 6.28318
#define AA 2

precision highp float;
precision mediump int;

uniform vec2 uResolution;

uniform int uRotateScene;
uniform vec2 uC;
uniform float uZMax;
uniform int uCChannel;
// uniform int uRotateC;
uniform int uTimeUpdateC;
uniform float uCRotateRange;

uniform int uTimeUpdateHue;
uniform float uHueBase;
uniform float uHueMultiplier;
uniform float uHueRange;

uniform float uSaturationBase;
uniform float uSaturationRange;

uniform float uLightnessBase;
uniform float uLightnessRange;

uniform int uGlow;
uniform float uGlowIntensity;

uniform int uScaleEnabled;

uniform int uSmoothShading;
uniform float uTime;
uniform float uCTime;
uniform float uSubBass;
uniform float uBass;
uniform float uLowMid;
uniform float uMid;
uniform float uHighMid;
uniform float uPresence;
uniform float uBrilliance;

varying vec2 vPos;
varying float vScale;
varying float vSaturation;
varying float vLightness;

vec3 hsl2rgb(float h, float s, float l) { // credit anastadunbar @ shadertoy: https://www.shadertoy.com/view/XljGzV
  vec3 rgb = clamp(abs(mod(h * 6. + vec3(0.0, 4., 2.), 6.) - 3.) - 1., 0., 1.);

  return l + s * (rgb - .5) * (1. - abs(2. * l - 1.));
}

float norm(float n, float min, float max) {
  return (n - min) / (max - min);
}


float norm2 (float n, float min1, float max1, float min2, float max2) {
  return min2 + ((n - min1) * (max2 - min2)) / (max1 - min1);
}

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

float julia(vec2 c, vec2 z) {
  float j, zz;

  for (float i = 0.; i < 1024.; i += 1.) {
    j = i;
    zz = dot(z, z);

    z = vec2(
      z.x * z.x - z.y * z.y,
      z.x * z.y * 2.
    ) + c;

    if (zz > uZMax) {
      break;
    }
  }

  if (uSmoothShading == 1) {
    // Smooth fractal shading: https://iquilezles.org/articles/msetsmooth/
    return j - log2(log2(zz)) + 4.;
  } else {
    return j;
  }
}

float getHue() {
  float hue = uHueBase * uHueRange;

  if (uTimeUpdateHue == 1) {
    hue += uTime * .000816;
  }

  return hue; // norm2(uHueBase * uHueRange, 0., 2., 0., 1.);
}

float getSaturation() {
  return uSaturationBase * uSaturationRange; // norm2(uSaturationBase + uSaturationRange, 0., 2., 0., 1.);
}

float getLightness() {
  return uLightnessBase * uLightnessRange; // norm2(uLightnessBase + uLightnessRange, 0., 2., 0., 1.);
}

void main() {
  vec2 aspect = uResolution.xy / uResolution.y;
  float scale = vScale;

  vec2 z = vPos * aspect;

  if (uScaleEnabled == 1) {
    z *= -vScale;
  }

  if (uRotateScene == 1) {
    float phi = uTime * .00025;

    mat2 rot = mat2(
      cos(phi), -sin(phi),
      sin(phi), cos(phi)
    );

    z *= rot;
  }

  vec2 c = vec2(uC);

  float theta = sin(uCRotateRange * .0312) * TAU;

  mat2 rotC = mat2(
    cos(theta), -sin(theta),
    sin(theta), cos(theta)
  );

  c *= rotC;

  if (uTimeUpdateC == 1) {
    float phi = cos(uCTime * .000132) * TAU;

    mat2 rotC = mat2(
      cos(phi), -sin(phi),
      sin(phi), cos(phi)
    );

    c *= rotC;
  }

  float f = julia(c, z);

  float h = fract(getHue() + (f * uHueRange * uHueMultiplier));
  float s = getSaturation();
  float l = .05 + getLightness() * .95;

  vec3 color = hsl2rgb(h, s, l);

  color = mix(
    vec3(0.),
    color,
    sin(f * .016)
  );

  float n = sin(f * uGlowIntensity * .0192);
  vec3 g = hsl2rgb(h, s, n);
  color += g;

  gl_FragColor = vec4(color, 1.);
}
