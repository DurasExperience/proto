import { Object3D, Vector2, Vector3, CatmullRomCurve3, Geometry, Mesh } from 'three'
import { MeshLine, MeshLineMaterial } from 'three.meshline'
import ParseVec3 from './../../../../utils/ParseVector3'

class ArcSpline extends Object3D {

  constructor( config, camera, controlsContainer ) {

    super()
    this.config = config
    this.duration = 2 + 1 * Math.random()
    this.progress = 0

    this.curve =  new THREE.CatmullRomCurve3( ParseVec3( this.config.points ) )

    this.geometry = new Geometry()
    this.geometry.vertices = this.curve.getPoints( 50 )
    this.geometry.computeBoundingBox()
    console.log( this.geometry.boundingBox )


    this.line = new MeshLine()
    this.line.setGeometry( this.geometry )

    this.resolution = new Vector2( window.innerWidth, window.innerHeight )

    this.material = new MeshLineMaterial({
      color: this.config.color,
      opacity: 1,
      useMap: 0,
      useAlphaMap: 0,
      lineWidth: this.config.lineWidth,
      resolution: this.resolution,
      sizeAttenuation: 0,
      near: camera.near,
      far: camera.far,
      transparent: true
    })
    this.material.uniforms.visibility.value = 0.

    this.mesh = new Mesh( this.line.geometry, this.material )
    this.mesh.scale.set( 3, 3, 3 )
    this.mesh.position.x = -30 + this.config.start.x
    this.mesh.position.y = 150
    this.mesh.position.z = -7000 + this.config.start.z
    this.add( this.mesh )
    this.bind()

  }

  bind() {

    [ 'resize', 'update' ]
        .forEach( ( fn ) => this[ fn ] = this[ fn ].bind( this ) )

  }

  start() {

    TweenMax.to( this, this.duration, { progress: 1 } )

  }

  update( time ) {

    this.mesh.material.uniforms.visibility.value = this.progress

  }

  resize( newWidth, newHeight ) {

    this.resolution.set( newWidth, newHeight )

  }

}

export default ArcSpline