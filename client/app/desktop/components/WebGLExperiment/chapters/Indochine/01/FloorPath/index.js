import Spline from './../../../../abstract/Spline'
import { Vector3 } from 'three'
import AudioManager from './../../../../../../../../helpers/AudioManager'

class FloorPath extends Spline {

  constructor( scene, container, duration ) {

    super( scene, container )
    this.duration = duration

  }

  init() {

    this.scene.camera.rotation.x = 1.15
    this.points = [
      new Vector3( 0, 0, 6000 ),
      new Vector3( 1100, 0, 1000 ),
      new Vector3( 1200, 0, -3500 )
    ]
    super.init()

  }

  createGeometry() {

    super.createGeometry()

  }

  start() {

    super.start()

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