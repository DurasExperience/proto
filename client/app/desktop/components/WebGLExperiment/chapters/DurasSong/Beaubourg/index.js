import { beaubourg as Config } from './../Config/'
import Store from './../../../../../../../flux/store/desktop'
import { Object3D, BufferGeometry, BufferAttribute, Mesh } from 'three'
import ParticlesMesh from './../../../abstract/ParticlesMesh'
import GUI from './../../../../../../../helpers/GUI'

class Beaubourg extends Object3D {

  constructor() {

    super()

    this.config = Config

    this.geometry = new BufferGeometry()

    this.max = 0

    const model = Store.getResource( '04_beaubourg' )
    model.traverse(( child ) => {

      if ( child instanceof Mesh ) {

        const positions = child.geometry.attributes.position.count
        this.max += positions
        for ( let i = 0, i3 = 0; i < positions; i ++, i3 += 3 ) {

          child.geometry.attributes.position.array[ i3 + 0 ] += 0.1 * Math.random()
          child.geometry.attributes.position.array[ i3 + 1 ] += 0.1 * Math.random()
          child.geometry.attributes.position.array[ i3 + 2 ] += 0.1 * Math.random()

        }

      }

    })
    this.geometry.addAttribute( 'position', new BufferAttribute( new Float32Array( ( this.max * 3 ) ), 3 ) )

    let offset = 0

    model.traverse(( child ) => {

      if ( child instanceof Mesh ) {

        this.geometry.merge( child.geometry, offset )
        offset += child.geometry.attributes.position.count

      }

    })
    console.log( this.geometry.attributes.position.count )
    this.mesh = new ParticlesMesh( 'beaubourg', this.geometry, this.config )
    this.mesh.position.y = this.config.position.y
    this.mesh.rotation.x = this.config.rotation.x
    this.mesh.rotation.y = this.config.rotation.y
    // this.mesh.position.z = -200
    this.add( this.mesh )

  }

  addGUI() {

    this.mesh.position.range = [ -1500, 1500 ]
    this.mesh.rotation.range = [ -3, 3 ]
    this.mesh.uniforms.amplitude.range = [ 0, 10 ]
    this.mesh.uniforms.frequency.range = [ 0, 10 ]
    this.mesh.uniforms.size.range = [ 0, 100 ]

    GUI.panel
      .addGroup({ label: 'Beaubourg', enable: false })
        .addSubGroup({ label: 'Position' })
          .addSlider( this.mesh.position, 'x', 'range', { step: 1 } )
          .addSlider( this.mesh.position, 'y', 'range', { step: 1 } )
          .addSlider( this.mesh.position, 'z', 'range', { step: 1 } )
        .addSubGroup({ label: 'Rotation' })
          .addSlider( this.mesh.rotation, 'x', 'range', { step: 0.01 } )
          .addSlider( this.mesh.rotation, 'y', 'range', { step: 0.01 } )
          .addSlider( this.mesh.rotation, 'z', 'range', { step: 0.01 } )
        .addSubGroup({ label: 'Particles' })
          .addSlider( this.mesh.uniforms.amplitude, 'value', 'range', { step: 0.01, label: 'amplitude' } )
          .addSlider( this.mesh.uniforms.frequency, 'value', 'range', { step: 0.01, label: 'frequency' } )
          .addSlider( this.mesh.uniforms.size, 'value', 'range', { step: 1, label: 'size' } )

  }

  update( time ) {

    this.mesh.update( time )

  }

}

export default Beaubourg
