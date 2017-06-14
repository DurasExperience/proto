import { Group, Vector2, Vector3, CatmullRomCurve3, Geometry, Mesh } from 'three'
import { MeshLine, MeshLineMaterial } from 'three.meshline'
import ParseVec3 from './../../../../utils/ParseVector3'
import GUI from './../../../../../../../../helpers/GUI'

class HandSplines extends Group {

  constructor( id, config, camera ) {

    super()
    this.config = config
    this.duration = 3 + 1 * Math.random()
    this.progress = 1
    this.handId = id
    this.name = `handSplines-${id}`


    this.resolution = new Vector2( window.innerWidth, window.innerHeight )

    this.material = new MeshLineMaterial({
      color: this.config.color,
      opacity: 1,
      useMap: 0,
      useAlphaMap: 0,
      lineWidth: 10,
      resolution: this.resolution,
      sizeAttenuation: 0,
      near: camera.near,
      far: camera.far,
      transparent: true
    })
    this.material.uniforms.visibility.value = 0.

    for ( let i = 0; i < this.config.splines.length; i++ ) {

      this.makeLine( i, this.config.splines[ i ] )

    }

    this.position.x = -525
    this.position.y = 267
    this.position.z = -890

    this.rotation.x = -1.34
    this.rotation.y = -2.2
    this.rotation.z = -0.86

    // this.mesh.position.x = -30 + this.config.start.x
    // this.mesh.position.y = 100
    // this.mesh.position.z = -6000 + this.config.start.z
    this.bind()
    this.addGUI()

  }

  makeLine( idx, config ) {

    const curve =  new CatmullRomCurve3( ParseVec3( config.points ) )

    const geometry = new Geometry()
    geometry.vertices = curve.getPoints( 50 )
    geometry.computeBoundingBox()
    geometry.boundingSphere = config.boundingSphere

    const line = new MeshLine()
    line.setGeometry( geometry )

    const mesh = new Mesh( line.geometry, this.material )
    mesh.scale.set( 110, 110, 110 )
    mesh.name = `handSplines-${this.handId}-${idx}`
    this.add( mesh )
    console.log( this.material )

  }

  bind() {

    [ 'resize', 'update' ]
        .forEach( ( fn ) => this[ fn ] = this[ fn ].bind( this ) )

  }

  addGUI() {

    this.position.range = [ -1500, 1500 ]
    this.rotation.range = [ -3, 3 ]

    GUI.panel
      .addGroup({ label: 'HandSplines', enable: true })
        .addSubGroup({ label: 'Position' })
          .addSlider( this.position, 'x', 'range', { step: 1 } )
          .addSlider( this.position, 'y', 'range', { step: 1 } )
          .addSlider( this.position, 'z', 'range', { step: 1 } )
        .addSubGroup({ label: 'Rotation' })
          .addSlider( this.rotation, 'x', 'range', { step: 0.01 } )
          .addSlider( this.rotation, 'y', 'range', { step: 0.01 } )
          .addSlider( this.rotation, 'z', 'range', { step: 0.01 } )

  }

  start() {

    TweenMax.to( this, this.duration, { progress: 1 } )

  }

  update( time ) {


    for ( let child of this.children ) {

      // child.update( time )
      child.material.uniforms.visibility.value = this.progress

    }

  }

  resize( newWidth, newHeight ) {

    this.resolution.set( newWidth, newHeight )

  }

}

export default HandSplines