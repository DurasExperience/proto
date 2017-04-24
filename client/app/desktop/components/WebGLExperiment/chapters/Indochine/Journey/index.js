import Spline from './../../../abstract/Spline/index'
import { Vector3 } from 'three'
import AudioManager from './../../../../../../../helpers/AudioManager'

class Journey extends Spline {

  constructor( scene, controlsContainer ) {

    super( scene, controlsContainer )
    this.voice = AudioManager.get( '01_01' )
    this.duration = Math.ceil( this.voice.duration() ) + 5
    this.bind()

  }

  bind() {

    [ 'reverse', 'fadeOutSound', 'restartSound' ]
        .forEach( ( fn ) => this[ fn ] = this[ fn ].bind( this ) )

  }

  init() {

    this.points = [
      new Vector3( 200, 3.5, 1200 ),
      new Vector3( -500, 3.5, -700 ),
      new Vector3( -150, 3.5, -6000 ),
      new Vector3( -300, 3.5, -9000 ),
      new Vector3( 800, -300, -15000 )
    ]
    this.voiceId = this.voice.play()
    AudioManager.fade( '01_01', 0, 1, 1000, this.voiceId )
    super.init()

  }

  createGeometry() {

    super.createGeometry()

  }

  reverse( d ) {

    super.reverse( d )
    this.d = d
    AudioManager.fade( '01_01', 1, 0, 400, this.voiceId )
    AudioManager.rate( '01_01', 0.75, this.voiceId )
    setTimeout( this.restartSound, d * 500 )

  }

  fadeOutSound() {

    AudioManager.fade( '01_01', 1, 0, 200, this.voiceId )

  }

  restartSound() {

    const newTime = this.voice.seek() - this.d
    AudioManager.rate( '01_01', 1, this.voiceId )
    AudioManager.setTime( '01_01', newTime, this.voiceId )
    AudioManager.fade( '01_01', 0, 1, 300, this.voiceId )


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