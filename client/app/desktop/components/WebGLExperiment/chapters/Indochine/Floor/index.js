import Config from './config'
import Store from './../../../../../../../flux/store/desktop'
import { Object3D, BufferGeometry, BufferAttribute } from 'three'
import ParticlesMesh from './../../../abstract/ParticlesMesh'
import GUI from './../../../../../../../helpers/GUI'

class Floor extends Object3D {

  constructor() {

    super()

    this.config = Config

    this.geometry = new BufferGeometry()
    this.positions = new Float32Array( this.config.count * 3 );

    for ( let i = 0, i3 = 0; i < this.config.count; i ++, i3 += 3 ) {

      this.positions[ i3 + 0 ] = ( Math.random() * 2 - 1 ) * this.config.radius;
      this.positions[ i3 + 1 ] = 0;
      this.positions[ i3 + 2 ] = ( Math.random() * 2 - 1 ) * this.config.radius;

    }
    this.geometry.addAttribute( 'position', new BufferAttribute( this.positions, 3 ) )
    this.geometry.computeBoundingSphere()

    this.mesh = new ParticlesMesh( 'Floor', this.geometry.attributes.position, Config )
    this.add( this.mesh )

    this.addGUI()

  }

  addGUI() {

    const noiseFolder = GUI.addFolder( 'Floor' )

    noiseFolder.add( this.mesh.uniforms.amplitude, 'value' ).min( 0 ).max( 30 ).step( 0.1 ).name( 'amplitude' )
    noiseFolder.add( this.mesh.uniforms.frequency, 'value' ).min( 0 ).max( 30 ).step( 0.1 ).name( 'frequency' )
    noiseFolder.add( this.mesh.uniforms.size, 'value' ).min( 1 ).max( 20 ).step( 0.1 ).name( 'size' )

  }

  update( time ) {

    this.mesh.update( time )

  }

}

export default Floor
