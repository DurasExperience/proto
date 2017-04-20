import Spline from './../../../abstract/Spline/index'
import { Vector3 } from 'three'
import AudioManager from './../../../../../../../helpers/AudioManager'

class FloorPath extends Spline {

  constructor( scene, container, duration ) {

    super( scene, container )
    this.duration = duration

  }

  init() {

    this.points = [
      new Vector3( 200, 0, 1200 ),
      new Vector3( -500, 0, -700 ),
      new Vector3( -150, 0, -6000 ),
      new Vector3( 800, 0, -12000 )
    ]
    super.init()

  }

  createGeometry() {

    super.createGeometry()

  }

  enableSpline() {

    super.enableSpline()

  }

  disableSpline() {

    super.disableSpline()
    
  }

  update() {

    super.update()

  }


}

export default FloorPath