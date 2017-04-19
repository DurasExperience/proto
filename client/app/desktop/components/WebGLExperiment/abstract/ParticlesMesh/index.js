import Config from './config'
import { Object3D, BufferGeometry, Vector3, ShaderMaterial, Color, AdditiveBlending, Points } from 'three'
import frag from './shaders/frag.glsl'
import vert from './shaders/vert.glsl'
import glslify from 'glslify'

class ParticlesMesh extends Object3D {

  /**
   * Abstract for Particle Mesh
   * @param {String} name 
   * @param {BufferAtribute} positions 
   * @param {object} config 
   */
  constructor( name, positions, config = Config ) {

    super()

    this.config = config

    this.geometry = new BufferGeometry()
    this.geometry.addAttribute( 'position', positions )

    // this.geometry.center( this.geometry )
    const scaleMatrix = new THREE.Matrix4()
    scaleMatrix.makeScale( this.config.scale.x, this.config.scale.y, this.config.scale.z )
    this.geometry.applyMatrix( scaleMatrix )
    this.geometry.computeVertexNormals()

    this.uniforms = {
      color: { value: new Color( 0xffffff ) },
      size: { value: this.config.size },
      amplitude: { value: this.config.amplitude },
      frequency: { value: this.config.frequency },
      time: { value: 0.0 }
    }

    this.material = new ShaderMaterial({
      uniforms: this.uniforms,
      fragmentShader: glslify( frag ),
      vertexShader: glslify( vert ),
      blending: AdditiveBlending,
      transparent: true,
      depthTest: false
    })
    
    this.mesh = new Points( this.geometry, this.material )
    this.mesh.name = name
    this.add( this.mesh )

  }

  update( time ) {

    this.uniforms.time.value = time

  }

}

export default ParticlesMesh