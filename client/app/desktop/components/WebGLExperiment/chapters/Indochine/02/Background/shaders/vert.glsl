uniform vec3 color;
uniform float size;
uniform float time;
uniform float amplitude;
uniform float amount;
uniform float amountByDegree;
uniform float frequency;
uniform float shift;

varying float noise;

#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)

const float PI = 3.14159265358979323846264;

void main() {

  float i = position.x;
  float a = floor( amount / amountByDegree );
  float angle = (i * PI) / a * 0.5;
  float radius = floor(i / amount * amountByDegree);

  vec3 pos = 2. + vec3(cos( angle ) * radius, 0, sin( angle ) * radius);


	float displacement = amplitude * cnoise3( shift * pos + time);
  vec3 newPosition = pos + displacement;
  vec4 mvPosition = modelViewMatrix * vec4( newPosition, 1.0 );
  noise = cnoise3( frequency * position );
  gl_PointSize = size * ( 300.0 / -mvPosition.z ) * noise;
  gl_Position = projectionMatrix * mvPosition;
  
}
