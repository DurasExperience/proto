import Config from './config'
import Store from './../../../../../../../flux/store'
import { Object3D, BufferGeometry, PlaneBufferGeometry, Vector3, BufferAttribute, ShaderMaterial, Color, AdditiveBlending, Points } from 'three'
import frag from './shaders/frag.glsl'
import vert from './shaders/vert.glsl'
import glslify from 'glslify'
import GUI from './../../../../../../../helpers/GUI'

class Floor extends Object3D {

  constructor() {

    super()

    this.config = Config


    this.geometry = new BufferGeometry()

    this.planeGeometry = new BufferGeometry()
    this.planePositions = new Float32Array( this.config.count * 3 );

    for ( let i = 0, i3 = 0; i < this.config.count; i ++, i3 += 3 ) {

      this.planePositions[ i3 + 0 ] = ( Math.random() * 2 - 1 ) * this.config.radius;
      this.planePositions[ i3 + 1 ] = 0;
      this.planePositions[ i3 + 2 ] = ( Math.random() * 2 - 1 ) * this.config.radius;

    }
    this.planeGeometry.addAttribute( 'position', new BufferAttribute( this.planePositions, 3 ) )
    this.planeGeometry.computeBoundingSphere()

    this.max = 0

    const model = Store.getResource( '01_floor' )
    model.traverse(( child ) => {

      if ( child instanceof THREE.Mesh ) {

        this.max += child.geometry.attributes.position.count

      }

    })

    console.log( this.planeGeometry )
    const planeGeometryMax = this.planeGeometry.attributes.position.count
    this.geometry.addAttribute( 'position', new BufferAttribute( new Float32Array( planeGeometryMax + ( this.max * 3 ) ), 3 ) )

    this.geometry.merge( this.planeGeometry, 0 )
    let offset = 0

    model.traverse(( child ) => {

      if ( child instanceof THREE.Mesh ) {

        this.geometry.merge( child.geometry, offset )
        offset += child.geometry.attributes.position.count

      }

    })

    // this.geometry.center( this.geometry )
    const scaleMatrix = new THREE.Matrix4()
    scaleMatrix.makeScale( 60, 150, 60 )
    this.geometry.applyMatrix( scaleMatrix )
    this.geometry.computeVertexNormals()

    this.uniforms = {
      color: { value: new Color( 0xffffff ) },
      size: { value: this.config.size },
      amplitude: { value: this.config.amplitude },
      frequency: { value: this.config.frequency },
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
    this.mesh.name = 'floor'
    this.add( this.mesh )

    this.addGUI()

  }

  addGUI() {

    const noiseFolder = GUI.addFolder( 'Floor' )

    noiseFolder.add( this.uniforms.amplitude, 'value' ).min( 0 ).max( 30 ).step( 0.1 ).name( 'amplitude' )
    noiseFolder.add( this.uniforms.frequency, 'value' ).min( 0 ).max( 30 ).step( 0.1 ).name( 'frequency' )
    noiseFolder.add( this.uniforms.size, 'value' ).min( 1 ).max( 20 ).step( 0.1 ).name( 'size' )

  }

  update( time ) {

    this.uniforms.time.value = time

  }

}

export default Floor