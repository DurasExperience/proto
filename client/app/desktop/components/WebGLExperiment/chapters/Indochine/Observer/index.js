import Spline from './../../../abstract/Spline/index'
import { Vector3 } from 'three'
import AudioManager from './../../../../../../../helpers/AudioManager'
import GUI from './../../../../../../../helpers/GUI'
import Config from './Config'

class Observer extends Spline {

  constructor( scene, controlsContainer, fadeOut ) {

    super( scene, controlsContainer )
    this.fadeOut = fadeOut
    this.config = Config
    this.voice = AudioManager.get( '01_02' )
    // this.duration = 50
    this.duration = Math.ceil( this.voice.duration() )
    this.bind()
    this.addListeners()

  }

  bind() {

    [ 'reverse', 'fadeOutSound', 'restartSound' ]
        .forEach( ( fn ) => this[ fn ] = this[ fn ].bind( this ) )

  }

  addListeners() {

    // this.voice.on( 'end', cb )

  }

  addGUI() {

    const observerFolder = GUI.addFolder( 'Observer' )
    observerFolder.open()
    const cameraFolder = observerFolder.addFolder( 'Camera rotation' )
    cameraFolder.add( this.scene.camera.rotation, 'x' ).min( -3 ).max( 3 ).step( 0.01 ).onChange( ( v ) => console.log( 'x', v ) )
    cameraFolder.add( this.scene.camera.rotation, 'y' ).min( -3 ).max( 3 ).step( 0.01 ).onChange( ( v ) => console.log( 'y', v ) )
    cameraFolder.add( this.scene.camera.rotation, 'z' ).min( -3 ).max( 3 ).step( 0.01 ).onChange( ( v ) => console.log( 'z', v ) )
    cameraFolder.open()

  }

  init() {

    this.scene.camera.position.x = this.config.camera.position.x
    this.scene.camera.position.y = this.config.camera.position.y
    this.scene.camera.position.z = this.config.camera.position.z
    this.scene.camera.rotation.x = this.config.camera.rotation.x
    this.scene.camera.rotation.y = this.config.camera.rotation.y
    this.scene.camera.rotation.z = this.config.camera.rotation.z
    this.points = [
      new Vector3( 0, 0, 1300 ),
      new Vector3( 0, 50, 800 ),
      new Vector3( 0, -10, 500 )
    ]
    this.voiceId = this.voice.play()
    AudioManager.fade( '01_01', 0, 1, 500, this.voiceId )
    this.addGUI()
    super.init()

  }

  createGeometry() {

    super.createGeometry()

  }

  reverse( d ) {

    super.reverse( d )
    this.d = d
    AudioManager.fade( '01_02', 1, 0, 400, this.voiceId )
    AudioManager.rate( '01_02', 0.75, this.voiceId )
    setTimeout( this.restartSound, d * 500 )

  }

  fadeOutSound() {

    AudioManager.fade( '01_02', 1, 0, 200, this.voiceId )

  }

  restartSound() {

    const newTime = this.voice.seek() - this.d
    AudioManager.rate( '01_02', 1, this.voiceId )
    AudioManager.setTime( '01_02', newTime, this.voiceId )
    AudioManager.fade( '01_02', 0, 1, 300, this.voiceId )


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

export default Observer