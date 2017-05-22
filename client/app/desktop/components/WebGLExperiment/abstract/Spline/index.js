import { CatmullRomCurve3, Geometry } from 'three'

class Spline {

  constructor( scene, controlsContainer ) {

    this.scene = scene
    this.controlsContainer = controlsContainer
    this.enabled = false
    this.onComplete = this.onComplete.bind( this )
    this.shift = {
      x: 0,
      y: 0,
      z: 0
    }

  }

  init() {

    this.curve = new CatmullRomCurve3( this.points )
    this.target = this.points[ this.points.length - 1 ]
    this.setupTimeline()

  }

  setupTimeline() {

    this.time = 0
    this.tl = new TimelineMax({ paused: true, onComplete: this.onComplete })
    this.tl.to( this, this.duration, { time: 1 } )

  }

  onComplete() {}

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
    setTimeout( () => this.tl.play(), d * 1000 )

  }

  enableSpline() {

    this.enabled = true

  }

  start() {

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

      this.camPos = this.curve.getPoint( this.time + 0.01 )

      const vector = {
        x: this.target.x - this.camPos.x,
        z: this.target.z - this.camPos.z
      }

      const angle = Math.atan2( vector.x, vector.z )

      const nextCamPos = this.curve.getPoint( this.time + 0.01 )

      // this.controlsContainer.position.x = (nextCamPos.x*2)-nextCamPos.x
      // this.controlsContainer.position.y = (nextCamPos.y*2)-nextCamPos.y
      // this.controlsContainer.position.z = (nextCamPos.z*2)-nextCamPos.z

      this.controlsContainer.rotation.y = 9.4 //TODO

      this.controlsContainer.position.x = this.camPos.x + this.shift.x
      this.controlsContainer.position.y = this.camPos.y + this.shift.y
      this.controlsContainer.position.z = this.camPos.z + this.shift.z


    }

  }

}

export default Spline
