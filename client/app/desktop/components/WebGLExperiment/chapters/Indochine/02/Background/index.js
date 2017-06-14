import { background as Config } from './../Config/'
import ParticlesMesh from './../../../../abstract/ParticlesMesh'
import Store from './../../../../../../../../flux/store/desktop'
import { Object3D, BufferGeometry, BufferAttribute, ShaderMaterial, AdditiveBlending, Points } from 'three'
import GUI from './../../../../../../../../helpers/GUI'
import glslify from 'glslify'
import frag from './shaders/frag.glsl'
import vert from './shaders/vert.glsl'
import AudioManager from './../../../../../../../../helpers/AudioManager'

class Background extends Object3D {

  constructor() {

    super()

    this.config = Config
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
      color1: { value: this.config.color1 },
      color2: { value: this.config.color2 },
      alpha: { value: this.config.alpha },
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
    this.mesh.name = 'background'
    this.mesh.position.z = this.config.position.z
    this.mesh.rotation.x = this.config.rotation.x
    this.mesh.rotation.y = this.config.rotation.y
    this.mesh.rotation.z = this.config.rotation.z
    this.add( this.mesh )

    this.heartbeatSound = AudioManager.get( '01_heartbeat' )
    this.heartbeatId = undefined

    this.setupTimeline()

  }

  addGUI() {

    this.mesh.position.range = [ -700, 700 ]
    this.mesh.rotation.range = [ -3, 3 ]
    this.uniforms.amplitude.range = [ 0, 100 ]
    this.uniforms.frequency.range = [ 0, 10 ]
    this.uniforms.size.range = [ 0, 100 ]
    this.uniforms.shift.range = [ 0, 100 ]
    this.uniforms.amountByDegree.range = [ 0, 20 ]

    GUI.panel
      .addGroup({ label: 'Background', enable: true })
        .addSubGroup({ label: 'Position' })
          .addSlider( this.mesh.position, 'x', 'range', { step: 1 } )
          .addSlider( this.mesh.position, 'y', 'range', { step: 1 } )
          .addSlider( this.mesh.position, 'z', 'range', { step: 1 } )
        .addSubGroup({ label: 'Rotation' })
          .addSlider( this.mesh.rotation, 'x', 'range', { step: 0.01 } )
          .addSlider( this.mesh.rotation, 'y', 'range', { step: 0.01 } )
          .addSlider( this.mesh.rotation, 'z', 'range', { step: 0.01 } )
        .addSubGroup({ label: 'Particles' })
          .addSlider( this.uniforms.amplitude, 'value', 'range', { step: 0.01, label: 'amplitude' } )
          .addSlider( this.uniforms.frequency, 'value', 'range', { step: 0.001, label: 'frequency' } )
          .addSlider( this.uniforms.size, 'value', 'range', { step: 1, label: 'size' } )
          .addSlider( this.uniforms.shift, 'value', 'range', { step: 0.001, label: 'shift' } )
          .addSlider( this.uniforms.amountByDegree, 'value', 'range', { step: 1, label: 'amountByDegree' } )

  }

  setupTimeline() {

    this.heartbeatTl = new TimelineMax({ paused: true, repeat: 2 })
    this.heartbeatTl.to( this.uniforms.alpha, 0.3, { value: 1 }, 0.1 )
    this.heartbeatTl.to( this.uniforms.size, 0.5, { value: 150, ease: Bounce.easeInOut }, 0.1 )
    this.heartbeatTl.to( this.uniforms.alpha, 0.5, { value: 0 }, 0.6 )
    this.heartbeatTl.to( this.uniforms.size, 0.5, { value: this.config.size, ease: Bounce.easeInOut }, 0.6 )

  }

  reverse() {

    if ( this.heartbeatId === undefined ) this.heartbeatId = this.heartbeatSound.play()
    else {
      this.heartbeatSound.seek( 0, this.heartbeatId )
      this.heartbeatSound.play()
    }
    this.heartbeatSound.fade( 0, 1, 100, this.heartbeatId )
    this.heartbeatTl.play( 0 )

  }

  update( time ) {

    this.uniforms.time.value = time

  }

}

export default Background
