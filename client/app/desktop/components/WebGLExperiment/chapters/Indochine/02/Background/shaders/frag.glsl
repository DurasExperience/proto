uniform vec3 color1;
uniform vec3 color2;
uniform float alpha;

varying float noise;

void main() {

  vec2 toCenter = ( gl_PointCoord.xy - 0.5 ) * 2.0;
  float len = length( toCenter );
  float a = 1.0 - len;
  a *= alpha;
  vec3 color = mix( color1, color2, noise );
  gl_FragColor = vec4( color, a );
  
}