import { Scene, OrthographicCamera, WebGLRenderTarget, BufferGeometry, BufferAttribute, Mesh, Points } from 'three'

export default class FBO {

  constructor( width, height, renderer, simulationMaterial, renderMaterial ) {

    this.scene = new Scene()
    this.orthoCamera = new OrthographicCamera( -1, 1, 1, -1, 1/Math.pow( 2, 53 ), 1)
    this.renderer = renderer
    this.width = width
    this.height = height
    this.simulationMaterial = simulationMaterial
    this.renderMaterial  = renderMaterial
    this.init()

  }
  init() {

    const gl = this.renderer.getContext()
    //1 we need FLOAT Textures to store positions
    //https://github.com/KhronosGroup/WebGL/blob/master/sdk/tests/conformance/extensions/oes-texture-float.html
    if ( !gl.getExtension( 'OES_texture_float' ) ){

      throw new Error( 'float textures not supported' )

    }
    //2 we need to access textures from within the vertex shader
    //https://github.com/KhronosGroup/WebGL/blob/90ceaac0c4546b1aad634a6a5c4d2dfae9f4d124/conformance-suites/1.0.0/extra/webgl-info.html
    if( gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) == 0 ) {

      throw new Error( 'vertex shader cannot read textures' )

    }

    const width = this.width
    const height = this.height

    //4 create a target texture
    const options = {
      minFilter: THREE.NearestFilter,//important as we want to sample square pixels
      magFilter: THREE.NearestFilter,//
      format: THREE.RGBAFormat,//could be RGBAFormat
      type:THREE.FloatType//important as we need precise coordinates (not ints)
    }

    this.rtt = new WebGLRenderTarget( this.width, this.height, options )

    const geom = new BufferGeometry()
    geom.addAttribute( 'position', new BufferAttribute( new Float32Array([ -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0 ]), 3 ) )
    geom.addAttribute( 'uv', new BufferAttribute( new Float32Array([ 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0 ]), 2 ) )
    this.scene.add( new Mesh( geom, this.simulationMaterial ) )

    //6 the particles:
    //create a vertex buffer of size width * height with normalized coordinates
    const l = ( width * height )
    const vertices = new Float32Array( l * 3 )

    for ( let i = 0; i < l; i++ ) {

      let i3 = i * 3
      vertices[ i3 ] = ( i % width ) / width 
      vertices[ i3 + 1 ] = ( i / width ) / height
      
    }
    
    //create the particles geometry
    let geometry = new BufferGeometry()
    geometry.addAttribute( 'position',  new BufferAttribute( vertices, 3 ) )
    this.particles = new Points( geometry, this.renderMaterial )

  }
  /**
   * update
   */
  update() {

    //1 update the simulation and render the result in a target texture
    this.renderer.render( this.scene, this.orthoCamera, this.rtt, true )
    //2 use the result of the swap as the new position for the particles' renderer
    this.particles.material.uniforms.positions.value = this.rtt.texture

  }
  
}
