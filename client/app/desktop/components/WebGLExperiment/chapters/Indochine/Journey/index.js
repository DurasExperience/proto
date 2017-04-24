import Spline from './../../../abstract/Spline/index'
import { Vector3 } from 'three'
import AudioManager from './../../../../../../../helpers/AudioManager'

class Journey extends Spline {

  constructor( scene, controlsContainer, drown ) {

    super( scene, controlsContainer )
    this.drown = drown
    this.voice = AudioManager.get( '01_01' )
    // this.duration = 50
    this.duration = Math.ceil( this.voice.duration() ) * 2
    this.bind()
    this.addListeners()
    this.willDrown = true

  }

  bind() {

    [ 'reverse', 'fadeOutSound', 'restartSound' ]
        .forEach( ( fn ) => this[ fn ] = this[ fn ].bind( this ) )

  }

  addListeners() {

    // this.voice.on( 'end', this.drown )

  }

  init() {

    this.points = [
      new Vector3( 400, 10, 5000 ),
      new Vector3( 1100, 10, -3000 ),
      new Vector3( 1200, -10, -4000 ),
      new Vector3( 1200, -20, -4500 ),
      new Vector3( 1200, -60, -8000 )
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
    if ( this.camPos.y < 1 && this.willDrown ) {

      this.willDrown = false
      this.drown()

    }

  }


}

export default Journey