import { CatmullRomCurve3, Geometry } from 'three'

class Spline {

  constructor( scene, controlsContainer ) {

    this.scene = scene
    this.controlsContainer = controlsContainer
    this.enabled = false

  }

  init() {

    this.curve = new CatmullRomCurve3( this.points )
    this.target = this.points[ this.points.length - 1 ]
    this.setupTimeline()

  }

  setupTimeline() {

    this.time = 0
    this.tl = new TimelineMax({ paused: true })
    this.tl.to( this, this.duration, { time: 1 } )

  }

  createGeometry() {

    this.geometry = new Geometry()
    this.geometry.vertices = this.curve.getPoints( 50 )
    this.material = new THREE.LineBasicMaterial({
      color: 0xFF0000
    })
		
    this.line = new THREE.Line( this.geometry, this.material )
    this.scene.add( this.line )

  }

  reverse( d ) {

    const time = d / this.duration
    const oldTime = this.time - time
    this.time -= oldTime
    this.tl.reverse()
    setTimeout( () => this.tl.play(), 2000 )

  }

  enableSpline() {

    this.enabled = true
    this.tl.play( 0 )

  }

  disableSpline() {

    this.enabled = false
    this.scene.remove( this.line )

  }

  clear() {

    this.tl.kill()
    this.tl.clear()

  }

  update() {

    if( this.enabled ) {

      const prevCamPos = this.curve.getPoint( this.time )

      this.camPos = this.curve.getPoint( this.time + 0.01 )

      const vector = {
        x: this.target.x - this.camPos.x,
        z: this.target.z - this.camPos.z
      }

      const angle = Math.atan2( vector.x, vector.z )

      this.controlsContainer.position.x = this.camPos.x
      this.controlsContainer.position.y = this.camPos.y
      this.controlsContainer.position.z = this.camPos.z

      this.controlsContainer.translateZ( this.camPos.z - prevCamPos.z )
      this.controlsContainer.translateX( this.camPos.x - prevCamPos.x )
      this.controlsContainer.translateY( this.camPos.y - prevCamPos.y )

      this.controlsContainer.rotation.y = angle

    }

  }

}

export default Spline