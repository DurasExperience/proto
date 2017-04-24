uniform vec3 color;
uniform float alpha;

void main() {

  vec2 toCenter = ( gl_PointCoord.xy - 0.5 ) * 2.0;
  float len = length( toCenter );
  float a = 1.0 - len;
  a *= alpha;
  gl_FragColor = vec4( color, a);
  
}