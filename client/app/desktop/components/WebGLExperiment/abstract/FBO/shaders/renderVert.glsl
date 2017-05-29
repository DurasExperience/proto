//float texture containing the positions of each particle
uniform sampler2D positions;
uniform float pointSize;
varying float size;

void main() {

    //the mesh is a nomrliazed square so the uvs = the xy positions of the vertices
    vec3 pos = texture2D( positions, position.xy ).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );

    //size
    gl_PointSize = size = max( 1., ( step( 1. - ( 1. / 10. ), position.x ) ) * pointSize );


}