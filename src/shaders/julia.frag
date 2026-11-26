precision highp float;
precision mediump int;

uniform vec2 uResolution;

uniform vec2 uSceneRotation;
uniform vec2 uCRotated;
uniform float uZMax;

uniform int uTimeUpdateHue;
uniform float uHueBase;
uniform float uHueMultiplier;
uniform float uHueRange;

uniform float uSaturationBase;
uniform float uSaturationRange;

uniform float uLightnessBase;
uniform float uLightnessRange;

uniform float uGlowIntensity;

uniform int uScaleEnabled;

uniform int uPower;
uniform int uSmoothShading;
uniform float uTime;
uniform float uSubBass;
uniform float uBass;
uniform float uLowMid;
uniform float uMid;
uniform float uHighMid;
uniform float uPresence;
uniform float uBrilliance;

varying vec2 vPos;
varying float vScale;

vec3 hsl2rgb(float h, float s, float l) { // credit anastadunbar @ shadertoy: https://www.shadertoy.com/view/XljGzV
  vec3 rgb = clamp(abs(mod(h * 6. + vec3(0.0, 4., 2.), 6.) - 3.) - 1., 0., 1.);

  return l + s * (rgb - .5) * (1. - abs(2. * l - 1.));
}

float julia2(vec2 c, vec2 z) {
  float j, zz;

  for (int i = 0; i < 256; i++) {
    j = float(i);
    zz = dot(z, z);

    z = vec2(
      (z.x * z.x) - (z.y * z.y),
      2. * z.x * z.y
    ) + c;

    if(zz > uZMax) break;
  }

  if (uSmoothShading == 1) {
    // Smooth fractal shading: https://iquilezles.org/articles/msetsmooth/
    return j - log2(log2(zz)) + 4.;
  } else {
    return j;
  }
}

float julia3(vec2 c, vec2 z) {
  float j, zz;

  for (int i = 0; i < 256; i++) {
    j = float(i);
    zz = dot(z, z);

    z = vec2(
      z.x * z.x * z.x - 3. * z.x * z.y * z.y,
      3. * z.x * z.x * z.y - z.y * z.y * z.y
    ) + c;

    if(zz > uZMax) break;
  }

  if (uSmoothShading == 1) {
    // Smooth fractal shading: https://iquilezles.org/articles/msetsmooth/
    return j - log2(log2(zz)) + 4.;
  } else {
    return j;
  }

  return j;
}

float julia4(vec2 c, vec2 z) {
  float j, zz;

  for (int i = 0; i < 256; i++) {
    float xx = z.x * z.x;
    float yy = z.y * z.y;
    float xy = z.x * z.y;
    float xxxx = xx * xx;
    float yyyy = yy * yy;

    j = float(i);
    zz = dot(z, z);


    z = vec2(
      xxxx - 6.0 * xx * yy + yyyy,
      4.0 * xx * xy - 4.0 * xy * yy
    ) + c;

    if(zz > uZMax) break;
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
    hue += uTime * .000213;
  }

  return hue;
}

float getSaturation() {
  return uSaturationBase * uSaturationRange;
}

float getLightness() {
  return uLightnessBase * uLightnessRange;
}

void main() {
  vec2 aspect = uResolution.xy / uResolution.y;
  vec2 z = vPos * aspect;

  if (uScaleEnabled == 1) {
    z *= -vScale;
  }

  z = vec2(
    z.x * uSceneRotation.x - z.y * uSceneRotation.y,
    z.x * uSceneRotation.y + z.y * uSceneRotation.x
  );

  vec2 c = uCRotated;

  float f;

  if (uPower == 2) {
    f = julia2(c, z);
  }
  if (uPower == 3) {
    f = julia3(c, z);
  }
  if (uPower == 4) {
    f = julia4(c, z);
  }

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
