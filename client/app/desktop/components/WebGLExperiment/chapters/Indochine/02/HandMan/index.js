import Config from './../Config/'
import Store from './../../../../../../../../flux/store/desktop'
import { Object3D, BufferGeometry, BufferAttribute } from 'three'
import ParticlesMesh from './../../../../abstract/ParticlesMesh'
import GUI from './../../../../../../../../helpers/GUI'

class handMan extends Object3D {

  constructor( duration ) {

    super()
    this.config = Config.handMan
    this.duration = duration

    this.geometry = new BufferGeometry()

    this.max = 0

    const model = Store.getResource( '01_arm' )

    //TODO ADD spline
    const splineHandMan = Store.getResource( 'spline-hand-man' )

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

    this.mesh = new ParticlesMesh( 'hand_man', this.geometry, this.config )
    this.mesh.position.set( this.config.position.x, this.config.position.y, this.config.position.z )
    this.mesh.rotation.set( this.config.rotation.x, this.config.rotation.y, this.config.rotation.z )
    this.add( this.mesh )

    this.reverse = this.reverse.bind( this )

  }

  addGUI() {

    this.mesh.position.range = [ -1500, 1500 ]
    this.mesh.rotation.range = [ -3, 3 ]
    this.mesh.uniforms.amplitude.range = [ 0, 100 ]
    this.mesh.uniforms.frequency.range = [ 0, 30 ]
    this.mesh.uniforms.size.range = [ 1, 50 ]

    GUI.panel
      .addGroup({ label: 'HandMan', enable: false })
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

    this.tl = new TimelineMax()
    // this.tl.to( this.mesh.uniforms.alpha, 10, { value: 1 }, 0 )

    this.tl.to( this.mesh.position, this.duration, {
      x: this.config.endPosition.x,
      y: this.config.endPosition.y,
      z: this.config.endPosition.z
    }, 0 )

    this.tl.to( this.mesh.rotation, this.duration, {
      x: this.config.endRotation.x,
      y: this.config.endRotation.y,
      z: this.config.endRotation.z
    }, 0 )

    this.tl.to( this.mesh.uniforms.color.value, this.duration, {
      r: this.config.endColor.r,
      g: this.config.endColor.g,
      b: this.config.endColor.b
    }, 0 )

    this.tl.to( this.mesh.uniforms.size, this.duration, { value: this.config.endSize }, 0 )
    // this.tl.to( this.mesh.uniforms.frequency, this.duration, { value: this.config.endFrequency }, 0 )
    // this.tl.to( this.mesh.uniforms.amplitude, this.duration, { value: this.config.endAmplitude }, 0 )

  }

  reverse( d ) {

    this.tl.reverse()
    this.tl.timeScale += .2
    setTimeout( () => this.tl.play(), d * 500 )

  }

  update( time ) {

    this.mesh.update( time )

  }

}

export default handMan
