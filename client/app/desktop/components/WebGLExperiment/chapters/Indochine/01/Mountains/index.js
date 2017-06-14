import Config from './../Config/'
import Store from './../../../../../../../../flux/store/desktop'
import { Object3D, BufferGeometry, BufferAttribute } from 'three'
import ParticlesMesh from './../../../../abstract/ParticlesMesh'
import GUI from './../../../../../../../../helpers/GUI'

class Mountains extends Object3D {

  constructor() {

    super()

    this.config = Config.mountains

    this.geometry = new BufferGeometry()

    this.max = 0

    const model = Store.getResource( '01_mountains' )
    model.traverse(( child ) => {

      if ( child instanceof THREE.Mesh ) {

        const positions = child.geometry.attributes.position.count
        this.max += positions
        for ( let i = 0, i3 = 0; i < positions; i ++, i3 += 3 ) {

          child.geometry.attributes.position.array[ i3 + 0 ] += 0.7 * Math.random()
          child.geometry.attributes.position.array[ i3 + 1 ] += 0.1 * Math.random()
          child.geometry.attributes.position.array[ i3 + 2 ] += 0.7 * Math.random()

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
    console.log( this.geometry.attributes.position.count )
    this.mesh = new ParticlesMesh( 'mountains', this.geometry, this.config )
    // this.mesh.position.y = -10
    // this.mesh.position.z = -200
    this.add( this.mesh )

  }

  addGUI() {

    this.mesh.uniforms.amplitude.range = [ 0, 10 ]
    this.mesh.uniforms.frequency.range = [ 0, 10 ]
    this.mesh.uniforms.size.range = [ 0, 100 ]

    GUI.panel
      .addGroup({ label: 'Mountains', enable: false })
        .addSlider( this.mesh.uniforms.amplitude, 'value', 'range', { step: 0.01, label: 'amplitude' } )
        .addSlider( this.mesh.uniforms.frequency, 'value', 'range', { step: 0.01, label: 'frequency' } )
        .addSlider( this.mesh.uniforms.size, 'value', 'range', { step: 1, label: 'size' } )

  }

  update( time ) {

    this.mesh.update( time )

  }

}

export default Mountains
