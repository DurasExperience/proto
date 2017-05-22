import Store from './../../../../../../../../flux/store/desktop'
import { Object3D, BufferGeometry, BufferAttribute } from 'three'
import ParticlesMesh from './../../../../abstract/ParticlesMesh'
import GUI from './../../../../../../../../helpers/GUI'
import Config from './../Config/'

class HandWoman extends Object3D {

  constructor( duration ) {

    super()

    this.config = Config.handWoman
    this.duration = duration

    this.geometry = new BufferGeometry()

    this.max = 0

    const model = Store.getResource( '01_hand_woman' )
    model.traverse(( child ) => {

      if ( child instanceof THREE.Mesh ) {

        const positions = child.geometry.attributes.position.count
        this.max += positions

      }

    })
    this.geometry.addAttribute( 'position', new BufferAttribute( new Float32Array( ( this.max * 3 ) ), 3 ) )

    let offset = 0

    model.traverse(( child ) => {

      if ( child instanceof THREE.Mesh ) {

        this.geometry.merge( child.geometry, offset )
        offset += child.geometry.attributes.position.count

      }

    })

    this.mesh = new ParticlesMesh( 'hand_woman', this.geometry.attributes.position, this.config )
    this.mesh.position.set( this.config.position.x, this.config.position.y, this.config.position.z )
    this.mesh.rotation.set( this.config.rotation.x, this.config.rotation.y, this.config.rotation.z )
    this.add( this.mesh )

  }

  addGUI() {

    this.mesh.position.range = [ -700, 700 ]
    this.mesh.rotation.range = [ -3, 3 ]
    this.mesh.uniforms.amplitude.range = [ 0, 100 ]
    this.mesh.uniforms.frequency.range = [ 0, 30 ]
    this.mesh.uniforms.size.range = [ 1, 50 ]

    GUI.panel
      .addGroup({ label: 'HandWoman', enable: false })
        .addSubGroup({ label: 'Position' })
          .addSlider( this.mesh.position, 'x', 'range', { step: 1 } )
          .addSlider( this.mesh.position, 'y', 'range', { step: 1 } )
          .addSlider( this.mesh.position, 'z', 'range', { step: 1 } )
        .addSubGroup({ label: 'Rotation' })
          .addSlider( this.mesh.rotation, 'x', 'range', { step: 0.01 } )
          .addSlider( this.mesh.rotation, 'y', 'range', { step: 0.01 } )
          .addSlider( this.mesh.rotation, 'z', 'range', { step: 0.01 } )
        .addSubGroup({ label: 'Particles' })
          .addSlider( this.mesh.uniforms.amplitude, 'value', 'range', { step: 1, label: 'amplitude' } )
          .addSlider( this.mesh.uniforms.frequency, 'value', 'range', { step: 0.1, label: 'frequency' } )
          .addSlider( this.mesh.uniforms.size, 'value', 'range', { step: 0.1, label: 'size' } )

  }

  init() {

    this.tl = new TimelineMax({ onComplete: () => this.mesh.uniforms.amplitude.value = this.config.endAmplitude })
    this.tl.to( this.mesh.position, this.duration, { x: this.config.endPosition.x }, 0 )
    this.tl.to( this.mesh.position, this.duration, { y: this.config.endPosition.y }, 0 )
    this.tl.to( this.mesh.position, this.duration, { z: this.config.endPosition.z }, 0 )

    this.tl.to( this.mesh.rotation, this.duration, { x: this.config.endRotation.x }, 0 )
    this.tl.to( this.mesh.rotation, this.duration, { y: this.config.endRotation.y }, 0 )
    this.tl.to( this.mesh.rotation, this.duration, { z: this.config.endRotation.z }, 0 )

    this.tl.to( this.mesh.uniforms.color.value, this.duration, { r: this.config.endColor.r }, 0 )
    this.tl.to( this.mesh.uniforms.color.value, this.duration, { g: this.config.endColor.g }, 0 )
    this.tl.to( this.mesh.uniforms.color.value, this.duration, { b: this.config.endColor.b }, 0 )

    this.tl.to( this.mesh.uniforms.size, this.duration, { value: this.config.endSize }, 0 )
    this.tl.to( this.mesh.uniforms.frequency, this.duration, { value: this.config.endFrequency }, 0 )
    this.tl.to( this.mesh.uniforms.amplitude, this.duration, { value: this.config.endAmplitude }, 0 )

  }

  reverse( d ) {

    this.tl.reverse()
    this.tl.timeScale += .2
    setTimeout( () => this.tl.play(), d * 2000 )

  }

  update( time ) {

    this.mesh.update( time )

  }

}

export default HandWoman
