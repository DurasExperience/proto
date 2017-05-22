import AudioSpline from './../../../../abstract/AudioSpline/index'
import { Vector3 } from 'three'
import AudioManager from './../../../../../../../../helpers/AudioManager'
import GUI from './../../../../../../../../helpers/GUI'
import Config from './../Config/'
import GlobalConfig from './../../../../../../../../config'

class Observer extends AudioSpline {

  constructor( scene, controlsContainer, fadeOut ) {

    super( scene, controlsContainer, '01_02' )
    this.fadeOut = fadeOut
    this.config = Config.observer
    /**
    * change audioSpline duration
    */
    this.duration = 30
    this.bind()

  }

  bind() {

    [ 'reverse', 'fadeOutSound', 'restartSound' ]
        .forEach( ( fn ) => this[ fn ] = this[ fn ].bind( this ) )

  }

  addGUI() {

    this.scene.camera.rotation.range = [ -3, 3 ]

    GUI.panel
      .addGroup({ label: 'Observer', enable: false })
        .addSlider( this.scene.camera.rotation, 'x', 'range', { step: 0.01, label: 'rX' } )
        .addSlider( this.scene.camera.rotation, 'y', 'range', { step: 0.01, label: 'rY' } )
        .addSlider( this.scene.camera.rotation, 'z', 'range', { step: 0.01, label: 'rZ' } )

  }

  init() {

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
    this.points = [
      new Vector3( 0, 10, 500 ),
      new Vector3( 0, -50, 800 ),
      new Vector3( 0, 0, 1300 )
    ]
    super.init()

  }

}

export default Observer
