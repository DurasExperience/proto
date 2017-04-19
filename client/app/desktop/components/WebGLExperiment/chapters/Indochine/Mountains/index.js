import Config from './config'
import Store from './../../../../../../../flux/store'
import { Object3D, BufferGeometry, BufferAttribute } from 'three'
import ParticlesMesh from './../../../abstract/ParticlesMesh'
import GUI from './../../../../../../../helpers/GUI'

class Mountains extends Object3D {

  constructor() {

    super()

    this.config = Config

    this.geometry = new BufferGeometry()

    this.max = 0

    const model = Store.getResource( '01_mountains' )
    model.traverse(( child ) => {

      if ( child instanceof THREE.Mesh ) {

        this.max += child.geometry.attributes.position.count

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

    this.mesh = new ParticlesMesh( 'mountains', this.geometry.attributes.position, Config )
    this.mesh.position.z = -1000
    this.add( this.mesh )

    this.addGUI()

  }

  addGUI() {

    const noiseFolder = GUI.addFolder( 'Mountains' )

    noiseFolder.add( this.mesh.uniforms.amplitude, 'value' ).min( 0 ).max( 30 ).step( 0.1 ).name( 'amplitude' )
    noiseFolder.add( this.mesh.uniforms.frequency, 'value' ).min( 0 ).max( 30 ).step( 0.1 ).name( 'frequency' )
    noiseFolder.add( this.mesh.uniforms.size, 'value' ).min( 1 ).max( 20 ).step( 0.1 ).name( 'size' )

  }

  update( time ) {

    this.mesh.update( time )

  }

}

export default Mountains