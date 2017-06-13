import { Object3D, Vector2, Vector3, CatmullRomCurve3, Geometry, LineBasicMaterial, Color, Mesh } from 'three'
import { MeshLine, MeshLineMaterial } from 'three.meshline'

class LineSpline extends Object3D {

  constructor( config, camera, controlsContainer ) {

    super()
    this.config = config
    this.duration = 1 + 1 * Math.random()
    this.progress = 0
    this.geometry = new Geometry()
    this.geometry.vertices.push( new Vector3( this.config.start.x, this.config.start.y, controlsContainer.position.z ) )
    this.geometry.vertices.push( new Vector3( this.config.end.x, this.config.end.y, this.config.end.z ) )

    this.line = new MeshLine()
    this.line.setGeometry( this.geometry, (  p ) => 2 + Math.sin( 50 * p ) )

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
    this.add( this.mesh )
    this.bind()

  }

  bind() {

    [ 'resize', 'update' ]
        .forEach( ( fn ) => this[ fn ] = this[ fn ].bind( this ) )

  }

  start() {

    TweenMax.to( this, this.duration, { progress: 0.5 } )

  }

  update( time ) {

    this.mesh.material.uniforms.visibility.value = this.progress

  }

  resize( newWidth, newHeight ) {

    this.resolution.set( newWidth, newHeight )

  }

}

export default LineSpline