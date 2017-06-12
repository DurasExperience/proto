import AudioSpline from './../../../../abstract/AudioSpline'
import { Vector3 } from 'three'
import AudioManager from './../../../../../../../../helpers/AudioManager'
import GlobalConfig from './../../../../../../../../config'
import { walk as Config } from './../Config'

class Walk extends AudioSpline {

  constructor( scene, controlsContainer, fadeOut ) {

    super( scene, controlsContainer, '02_01_voice' )
    this.config = Config
    this.fadeOut = fadeOut
    this.duration = 12
    this.bind()

  }

  bind() {

    [ 'reverse', 'fadeOutSound', 'restartSound' ]
        .forEach( ( fn ) => this[ fn ] = this[ fn ].bind( this ) )

  }

  init() {


    this.points = [
      new Vector3( 0, 400, 0 ),
      new Vector3( 0, 400, -6000 )
    ]
    if ( GlobalConfig.debug ) {

      this.controlsContainer.position.x = this.config.camera.position.x
      this.controlsContainer.position.y = this.config.camera.position.y
      this.controlsContainer.position.z = this.config.camera.position.z
      this.controlsContainer.rotation.x = this.config.camera.rotation.x
      this.controlsContainer.rotation.y = this.config.camera.rotation.y
      this.controlsContainer.rotation.z = this.config.camera.rotation.z

    } else {

      this.scene.camera.position.x = this.config.camera.position.x
      this.scene.camera.position.y = this.config.camera.position.y
      this.scene.camera.position.z = this.config.camera.position.z
      this.scene.camera.rotation.x = this.config.camera.rotation.x
      this.scene.camera.rotation.y = this.config.camera.rotation.y
      this.scene.camera.rotation.z = this.config.camera.rotation.z

    }
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

export default Walk