import { buildings as Config } from './../Config/'
import Store from './../../../../../../../../flux/store/desktop'
import { Object3D, BufferGeometry, BufferAttribute, Mesh, MeshBasicMaterial, Matrix4 } from 'three'
import ParticlesMesh from './../../../../abstract/ParticlesMesh'
import GUI from './../../../../../../../../helpers/GUI'

class Buildings extends Object3D {

  constructor() {

    super()

    this.config = Config

    this.geometry = new BufferGeometry()

    this.max = 0

    const model = Store.getResource( '02_01_building' )
    model.traverse(( child ) => {

      if ( child instanceof Mesh ) {

        for ( let i = 0; i < this.config.slices * 2 + 1; i++ ) {

          const positions = child.geometry.attributes.position.count
          this.max += positions

          for ( let i = 0, i3 = 0; i < positions; i ++, i3 += 3 ) {

            child.geometry.attributes.position.array[ i3 + 0 ] += 0.1 * Math.random()
            child.geometry.attributes.position.array[ i3 + 1 ] += 0.05 * Math.random()
            child.geometry.attributes.position.array[ i3 + 2 ] += 0.1 * Math.random()

          }
        }

      }

    })
    this.geometry.addAttribute( 'position', new BufferAttribute( new Float32Array( ( this.max * 3 ) ), 3 ) )
    let offset = 0
    const scaleMatrix = new Matrix4()
    scaleMatrix.makeScale( 1, 1, 1.5 )

    model.traverse(( child ) => {

      if ( child instanceof Mesh ) {

        child.geometry.computeBoundingBox()
        const w = Math.abs( child.geometry.boundingBox.min.x ) + child.geometry.boundingBox.max.x

        // Right side
        for ( let i = 0; i < this.config.slices; i++ ) {
          
          child.geometry.translate( -i * w, 0 , 0 )
          this.geometry.merge( child.geometry, offset )
          offset += child.geometry.attributes.position.count
          child.geometry.translate( i * w, 0 , 0 )

        }

        // Left side
        child.geometry.rotateY( Math.PI )

        for ( let i = 0; i < this.config.slices; i++ ) {
          
          child.geometry.translate( -i * w, 0 , - 1.25 * w )
          this.geometry.merge( child.geometry, offset )
          offset += child.geometry.attributes.position.count
          child.geometry.translate( i * w, 0 , 1.25 * w )

        }

        // Opposite
        child.geometry.rotateY( -Math.PI / 2 )
        child.geometry.translate( w, 0 , -w / 3 )   
        child.geometry.applyMatrix( scaleMatrix )
        this.geometry.merge( child.geometry, offset )
        offset += child.geometry.attributes.position.count
        child.geometry.translate( -w, 0 , w / 3 )

      }

    })

    this.geometry.rotateY( Math.PI / 2 )

    const mat = new MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true
    })

    // const scaleMatrix = new Matrix4()
    // scaleMatrix.makeScale( 200, 200, 200 )
    // geometry.applyMatrix( scaleMatrix )

    // this.mesh = new Mesh( geometry, mat )

    this.mesh = new ParticlesMesh( 'buildings', this.geometry, this.config )
    this.mesh.position.x = this.config.position.x
    this.mesh.position.z = this.config.position.z
    this.add( this.mesh )

  }

  addGUI() {

    this.mesh.uniforms.amplitude.range = [ 0, 10 ]
    this.mesh.uniforms.frequency.range = [ 0, 10 ]
    this.mesh.uniforms.size.range = [ 0, 100 ]
    this.mesh.position.range = [ -8000, 3000 ]
    this.mesh.rotation.range = [ -3, 3 ]

    GUI.panel
      .addGroup({ label: 'Buildings', enable: true })
        .addSubGroup({ label: 'Particles' })
          .addSlider( this.mesh.uniforms.amplitude, 'value', 'range', { step: 0.01, label: 'amplitude' } )
          .addSlider( this.mesh.uniforms.frequency, 'value', 'range', { step: 0.01, label: 'frequency' } )
          .addSlider( this.mesh.uniforms.size, 'value', 'range', { step: 1, label: 'size' } )
        .addSubGroup({ label: 'Position' })
          .addSlider( this.mesh.position, 'x', 'range', { step: 1 } )
          .addSlider( this.mesh.position, 'y', 'range', { step: 1 } )
          .addSlider( this.mesh.position, 'z', 'range', { step: 1 } )
        .addSubGroup({ label: 'Rotation' })
          .addSlider( this.mesh.rotation, 'x', 'range', { step: 0.01 } )
          .addSlider( this.mesh.rotation, 'y', 'range', { step: 0.01 } )
          .addSlider( this.mesh.rotation, 'z', 'range', { step: 0.01 } )

  }

  update( time ) {

    this.mesh.update( time )

  }

}

export default Buildings
