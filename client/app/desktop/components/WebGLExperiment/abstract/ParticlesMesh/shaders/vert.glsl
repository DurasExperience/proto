uniform vec3 color;
uniform float size;
uniform float time;
uniform float amplitude;
uniform float frequency;

#pragma glslify: cnoise3 = require(glsl-noise/classic/3d) 

void main() {
  
	float displacement = amplitude * cnoise3( frequency * position + time );

  vec3 newPosition = position + normal * displacement;
  vec4 mvPosition = modelViewMatrix * vec4( newPosition, 1.0 );
  gl_PointSize = size * ( 500.0 / -mvPosition.z );
  gl_Position = projectionMatrix * mvPosition;
  
}