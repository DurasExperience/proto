import Config from './config'
import Store from './../../../../../../../flux/store/desktop'
import { Object3D, BufferGeometry, BufferAttribute } from 'three'
import ParticlesMesh from './../../../abstract/ParticlesMesh'
import GUI from './../../../../../../../helpers/GUI'

class HandWoman extends Object3D {

  constructor() {

    super()

    this.config = Config
    this.duration = 20

    this.geometry = new BufferGeometry()

    this.max = 0

    const model = Store.getResource( '01_hand_woman' )
    model.traverse(( child ) => {

      if ( child instanceof THREE.Mesh ) {

        const positions = child.geometry.attributes.position.count
        this.max += positions
        for ( let i = 0, i3 = 0; i < positions; i ++, i3 += 3 ) {

          child.geometry.attributes.position.array[ i3 + 0 ] += 0.05 * Math.random()
          child.geometry.attributes.position.array[ i3 + 1 ] += 0.05 * Math.random()
          child.geometry.attributes.position.array[ i3 + 2 ] += 0.05 * Math.random()

        }

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

    this.mesh = new ParticlesMesh( 'hand_woman', this.geometry.attributes.position, Config )
    this.mesh.position.set( this.config.position.x, this.config.position.y, this.config.position.z )
    this.mesh.rotation.set( this.config.rotation.x, this.config.rotation.y, this.config.rotation.z )
    this.add( this.mesh )

    this.addGUI()
    this.init()

  }

  addGUI() {

    const handFolder = GUI.addFolder( 'Hand Woman' )
    // handFolder.open()
    const particlesFolder = handFolder.addFolder( 'Particles' )
    particlesFolder.add( this.mesh.uniforms.amplitude, 'value' ).min( 0 ).max( 100 ).step( 1 ).name( 'amplitude' )
    particlesFolder.add( this.mesh.uniforms.frequency, 'value' ).min( 0 ).max( 30 ).step( 0.1 ).name( 'frequency' )
    particlesFolder.add( this.mesh.uniforms.size, 'value' ).min( 1 ).max( 50 ).step( 0.1 ).name( 'size' )
    particlesFolder.open()

    const positionFolder = handFolder.addFolder( 'Position' )
    positionFolder.add( this.mesh.position, 'x' ).min( -700 ).max( 700 ).step( 1 )
    positionFolder.add( this.mesh.position, 'y' ).min( -700 ).max( 700 ).step( 1 )
    positionFolder.add( this.mesh.position, 'z' ).min( -700 ).max( 700 ).step( 1 )
    positionFolder.open()

    const rotationFolder = handFolder.addFolder( 'Rotation' )
    rotationFolder.add( this.mesh.rotation, 'x' ).min( -3 ).max( 3 ).step( 0.01 ).onChange( ( v ) => console.log( 'x', v ) )
    rotationFolder.add( this.mesh.rotation, 'y' ).min( -3 ).max( 3 ).step( 0.01 ).onChange( ( v ) => console.log( 'y', v ) )
    rotationFolder.add( this.mesh.rotation, 'z' ).min( -3 ).max( 3 ).step( 0.01 ).onChange( ( v ) => console.log( 'z', v ) )
    rotationFolder.open()

  }

  init() {

    const tl = new TimelineMax({ paused: true })
    // tl.to( this.mesh.uniforms.amplitude, 2, { value: this.config.endAmplitude }, 0 )
    tl.to( this.mesh.position, this.duration, { x: this.config.endPosition.x }, 0 )
    tl.to( this.mesh.position, this.duration, { y: this.config.endPosition.y }, 0 )
    tl.to( this.mesh.position, this.duration, { z: this.config.endPosition.z }, 0 )
    tl.to( this.mesh.rotation, this.duration, { x: this.config.endRotation.x }, 0 )
    tl.to( this.mesh.rotation, this.duration, { y: this.config.endRotation.y }, 0 )
    tl.to( this.mesh.rotation, this.duration, { z: this.config.endRotation.z }, 0 )
    tl.to( this.mesh.uniforms.color.value, this.duration, { r: this.config.endColor.r }, 0 )
    tl.to( this.mesh.uniforms.color.value, this.duration, { g: this.config.endColor.g }, 0 )
    tl.to( this.mesh.uniforms.color.value, this.duration, { b: this.config.endColor.b }, 0 )

    setTimeout(function() {

      tl.play( 0 )

    }, 1000)

  }

  update( time ) {

    this.mesh.update( time )

  }

}

export default HandWoman
