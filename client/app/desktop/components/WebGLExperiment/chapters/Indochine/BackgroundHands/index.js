import Config from './config'
import Store from './../../../../../../../flux/store/desktop'
import { Object3D, BufferGeometry, BufferAttribute } from 'three'
import ParticlesMesh from './../../../abstract/ParticlesMesh'
import GUI from './../../../../../../../helpers/GUI'

class BackgroundHands extends Object3D {

  constructor() {

    super()

    this.config = Config

    this.geometry = new BufferGeometry()
    this.positions = new Float32Array( this.config.count * 3 )

    for ( let i = 0, i3 = 0; i < this.config.count; i++, i += 3 ) {

      this.positions[ i3 + 0 ] = ( Math.random() * 2 - 1 ) * this.config.radius
      this.positions[ i3 + 1 ] = ( Math.random() * 2 - 1 ) * this.config.radius
      this.positions[ i3 + 2 ] = ( Math.random() * 2 - 1 ) * this.config.radius

    }

    const bufferPositions = new BufferAttribute( this.positions, 3 )
    this.mesh = new ParticlesMesh( 'background_hands', bufferPositions, Config )
    this.mesh.position.set( this.config.position.x, this.config.position.y, this.config.position.z )
    this.mesh.rotation.set( this.config.rotation.x, this.config.rotation.y, this.config.rotation.z )
    this.add( this.mesh )

    this.addGUI()

  }

  addGUI() {

    const handFolder = GUI.addFolder( 'Backgrounds Hands' )
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

  update( time ) {

    this.mesh.update( time )

  }

}

export default BackgroundHands
