import Spline from './../../../abstract/Spline/index'
import { Vector3 } from 'three'
import AudioManager from './../../../../../../../helpers/AudioManager'

class FloorPath extends Spline {

  constructor( scene, container, duration ) {

    super( scene, container )
    this.duration = duration

  }

  init() {

    this.scene.camera.rotation.x = 1.15
    this.points = [
      new Vector3( 400, 0, 5000 ),
      new Vector3( 1100, 0, -3000 ),
      new Vector3( 1200, 0, -4000 ),
      new Vector3( 1200, 0, -4500 ),
      new Vector3( 1200, 0, -8000 )
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