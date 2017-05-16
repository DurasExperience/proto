import AudioSpline from './../../../../abstract/AudioSpline'
import { Vector3 } from 'three'
import AudioManager from './../../../../../../../../helpers/AudioManager'

class Journey extends AudioSpline {

  constructor( scene, controlsContainer, drown, fadeOut ) {

    super( scene, controlsContainer, '01_01' )
    this.drown = drown
    this.fadeOut = fadeOut
    // this.duration = 5
    this.willDrown = true
    this.bind()

  }

  bind() {

    [ 'reverse', 'fadeOutSound', 'restartSound' ]
        .forEach( ( fn ) => this[ fn ] = this[ fn ].bind( this ) )

  }

  init() {

    this.points = [
      new Vector3( 400, 10, 2000 ),
      new Vector3( 1100, 10, -3000 ),
      new Vector3( 1200, -10, -4000 ),
      new Vector3( 1200, -20, -4500 ),
      new Vector3( 1200, -60, -8000 )
    ]
    super.init()

  }

  play() {

    super.play()

  }

  createGeometry() {

    super.createGeometry()

  }

  reverse( d ) {

    super.reverse( d )

  }

  fadeOutSound() {

    super.fadeOutSound()

  }

  restartSound() {

    super.restartSound()

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

  onComplete() {

    super.onComplete()
    this.fadeOut()

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