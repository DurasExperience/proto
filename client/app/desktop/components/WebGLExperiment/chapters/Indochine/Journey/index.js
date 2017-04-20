import Spline from './../../../abstract/Spline/index'
import { Vector3 } from 'three'

class Journey extends Spline {

  constructor( scene, controlsContainer ) {

    super( scene, controlsContainer )
    this.duration = 30

  }

  init() {

    this.points = [
      new Vector3( 2700, 0, 500 ),
      new Vector3( -500, 0, -500 ),
      new Vector3( -700, 0, -6000 )
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

export default Journey