varying vec2 vUV;
varying float vAmount;

void main() {
  vec2 toCenter = (gl_PointCoord.xy - 0.5) * 2.0;
  float len = length(toCenter);
  float a = 1.0 - len;
  gl_FragColor = vec4(1.0, 1.0, 1.0, a);
}