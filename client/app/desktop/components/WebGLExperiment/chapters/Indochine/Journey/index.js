import Spline from './../../../abstract/Spline/index'
import { Vector3 } from 'three'
import AudioManager from './../../../../../../../helpers/AudioManager'

class Journey extends Spline {

  constructor( scene, controlsContainer ) {

    super( scene, controlsContainer )
    this.voice = AudioManager.get( '01_01' )
    this.duration = Math.ceil( this.voice.duration() ) + 5

  }

  init() {

    this.points = [
      new Vector3( 200, 30, 1200 ),
      new Vector3( -500, 0, -700 ),
      new Vector3( -150, 10, -6000 ),
      new Vector3( 800, -300, -12000 )
    ]
    this.voiceId = this.voice.play()
    AudioManager.fade( '01_01', 0, 1, 1000, this.voiceId )
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