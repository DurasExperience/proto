import Config from './config'
import Store from './../../../../../../../flux/store'
import { Object3D, BufferGeometry, BufferAttribute, ShaderMaterial, AdditiveBlending, Points } from 'three'
import GUI from './../../../../../../../helpers/GUI'
import glslify from 'glslify'
import frag from './shaders/frag.glsl'
import vert from './shaders/vert.glsl'

class Floor extends Object3D {

  constructor() {

    super()

    this.config = Config
    this.circleGeometry = new BufferGeometry()
    this.positions = new Float32Array( this.config.amount * 3 );

    for ( let i = 0, i3 = 0; i < this.config.amount; i ++, i3 += 3 ) {

      this.positions[ i3 + 0 ] = i
      this.positions[ i3 + 1 ] = 0
      this.positions[ i3 + 2 ] = 0

    }
    this.circleGeometry.addAttribute( 'position', new BufferAttribute( this.positions, 3 ) )
    this.circleGeometry.computeBoundingSphere()
    
    this.geometry = new BufferGeometry()
    this.geometry.addAttribute( 'position', this.circleGeometry.attributes.position )

    // this.geometry.center( this.geometry )
    const scaleMatrix = new THREE.Matrix4()
    scaleMatrix.makeScale( this.config.scale.x, this.config.scale.y, this.config.scale.z )
    this.geometry.applyMatrix( scaleMatrix )
    this.geometry.computeVertexNormals()
    this.geometry.normalizeNormals()

    this.uniforms = {
      color: { value: this.config.color },
      size: { value: this.config.size },
      amplitude: { value: this.config.amplitude },
      frequency: { value: this.config.frequency },
      shift: { value: this.config.shift },
      amount: { value: this.config.amount },
      amountByDegree: { value: this.config.amountByDegree },
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
    this.mesh.rotation.y = -Math.PI / 6
    // this.mesh.position.z = 50
    this.add( this.mesh )

    this.addGUI()

  }

  addGUI() {

    const noiseFolder = GUI.addFolder( 'Floor' )

    noiseFolder.add( this.uniforms.amplitude, 'value' ).min( 0 ).max( 100 ).step( 0.1 ).name( 'amplitude' )
    noiseFolder.add( this.uniforms.frequency, 'value' ).min( 0 ).max( 1 ).step( 0.001 ).name( 'frequency' )
    noiseFolder.add( this.uniforms.shift, 'value' ).min( 0 ).max( 0.1 ).step( 0.001 ).name( 'shift' )
    noiseFolder.add( this.uniforms.size, 'value' ).min( 1 ).max( 50 ).step( 0.1 ).name( 'size' )
    noiseFolder.add( this.uniforms.amountByDegree, 'value' ).min( 0 ).max( 100 ).step( 0.1 ).name( 'amount/degree' )
    noiseFolder.open()

  }

  update( time ) {

    this.uniforms.time.value = time

  }

}

export default Floor