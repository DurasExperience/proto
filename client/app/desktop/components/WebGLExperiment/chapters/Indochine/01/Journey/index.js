import AudioSpline from './../../../../abstract/AudioSpline'
import { Vector3 } from 'three'
import AudioManager from './../../../../../../../../helpers/AudioManager'
import GlobalConfig from './../../../../../../../../config'

class Journey extends AudioSpline {

  constructor( scene, controlsContainer, fadeOut ) {

    super( scene, controlsContainer, '01_01' )
    this.fadeOut = fadeOut
    this.duration = 100
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
      new Vector3( 1200, 10, -4000 ),
      new Vector3( 1200, 10, -4500 ),
      new Vector3( 1200, 10, -8000 )
    ]
    if ( GlobalConfig.debug ) this.scene.camera.position.set( this.points[ 0 ].x, this.points[ 0 ].y, this.points[ 0 ].z )
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

  }


}

export default Journey