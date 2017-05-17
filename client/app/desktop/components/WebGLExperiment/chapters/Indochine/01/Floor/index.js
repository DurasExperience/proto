import Config from './../Config/'
import ParticlesMesh from './../../../../abstract/ParticlesMesh'
import Store from './../../../../../../../../flux/store/desktop'
import { Object3D, BufferGeometry, BufferAttribute, ShaderMaterial, AdditiveBlending, Points } from 'three'
import GUI from './../../../../../../../../helpers/GUI'
import glslify from 'glslify'
import frag from './shaders/frag.glsl'
import vert from './shaders/vert.glsl'

class Floor extends Object3D {

  constructor() {

    super()

    this.config = Config.floor
    this.circleGeometry = new BufferGeometry()
    this.positions = new Float32Array( this.config.amount * 3 );

    for ( let i = 0, i3 = 0; i < this.config.amount; i ++, i3 += 3 ) {

      this.positions[ i3 + 0 ] = i
      this.positions[ i3 + 1 ] = 0
      this.positions[ i3 + 2 ] = 0

    }
    this.circleGeometry.addAttribute( 'position', new BufferAttribute( this.positions, 3 ) )
    this.circleGeometry.computeBoundingSphere()

    this.geometry = new BufferGeometry()
    this.geometry.addAttribute( 'position', this.circleGeometry.attributes.position )

    // this.geometry.center( this.geometry )
    const scaleMatrix = new THREE.Matrix4()
    scaleMatrix.makeScale( this.config.scale.x, this.config.scale.y, this.config.scale.z )
    this.geometry.applyMatrix( scaleMatrix )
    this.geometry.computeVertexNormals()
    this.geometry.normalizeNormals()

    this.uniforms = {
      color: { value: this.config.color },
      size: { value: this.config.size },
      amplitude: { value: this.config.amplitude },
      frequency: { value: this.config.frequency },
      shift: { value: this.config.shift },
      amount: { value: this.config.amount },
      amountByDegree: { value: this.config.amountByDegree },
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
    this.mesh.name = 'floor'
    this.mesh.rotation.y = -Math.PI / 6
    // this.mesh.position.z = 50
    this.add( this.mesh )

  }

  addGUI() {

    this.uniforms.amplitude.range = [ 0, 10 ]
    this.uniforms.frequency.range = [ 0, 2 ]
    this.uniforms.size.range = [ 0, 20 ]
    this.uniforms.shift.range = [ 0, 1 ]
    this.uniforms.amountByDegree.range = [ 0, 20 ]

    GUI.panel
      .addGroup({ label: 'Floor', enable: false })
        .addSlider( this.uniforms.amplitude, 'value', 'range', { step: 0.01, label: 'amplitude' } )
        .addSlider( this.uniforms.frequency, 'value', 'range', { step: 0.001, label: 'frequency' } )
        .addSlider( this.uniforms.size, 'value', 'range', { step: 1, label: 'size' } )
        .addSlider( this.uniforms.shift, 'value', 'range', { step: 0.001, label: 'shift' } )
        .addSlider( this.uniforms.amountByDegree, 'value', 'range', { step: 1, label: 'amountByDegree' } )

  }

  update( time ) {

    this.uniforms.time.value = time

  }

}

export default Floor
