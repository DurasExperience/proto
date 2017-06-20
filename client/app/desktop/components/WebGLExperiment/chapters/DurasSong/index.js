import { Group, Mesh, SphereBufferGeometry, MeshBasicMaterial } from 'three'
import Beaubourg from './Beaubourg'

import Actions from './../../../../../../flux/actions'
import Store from './../../../../../../flux/store/desktop'
import EventsConstants from './../../../../../../flux/constants/EventsConstants'
import AudioManager from './../../../../../../helpers/AudioManager'
import GUI from './../../../../../../helpers/GUI'
import { durasSong as Config } from './Config/'
import GlobalConfig from './../../../../../../config'
import ClearObject3D from './../../utils/ClearObject3D'

import BoxBlurPass from 'avdp-wagner/src/passes/box-blur/BoxBlurPass'
import VignettePass from 'avdp-wagner/src/passes/vignette/VignettePass'
import ZoomBlurPass from 'avdp-wagner/src/passes/zoom-blur/ZoomBlurPass'
import MultiPassBloomPass from 'avdp-wagner/src/passes/bloom/MultiPassBloomPass'

class DurasSong extends Group {

  constructor( scene, controlsContainer ) {

    super()
    this.name = 'duras-song'
    this.scene = scene
    this.controlsContainer = controlsContainer
    this.config = Config
    this.bind()

    this.beaubourg = new Beaubourg()
    this.add( this.beaubourg )
    this.objects = [ this.beaubourg ]

    this.initPostProcessing()

  }

  bind() {

    [ 'resize', 'update' ]
      .forEach( ( fn ) => this[ fn ] = this[ fn ].bind( this ) )

  }


  start() {

    if ( GlobalConfig.debug ) {

      this.controlsContainer.position.x = 0
      this.controlsContainer.position.y = 0
      this.controlsContainer.position.z = 0
      this.controlsContainer.rotation.x = 0
      this.controlsContainer.rotation.y = 0
      this.controlsContainer.rotation.z = 0
      this.controlsContainer.position.x = this.config.camera.position.x
      this.controlsContainer.position.y = this.config.camera.position.y
      this.controlsContainer.position.z = this.config.camera.position.z
      this.controlsContainer.rotation.x = this.config.camera.rotation.x
      this.controlsContainer.rotation.y = this.config.camera.rotation.y
      this.controlsContainer.rotation.z = this.config.camera.rotation.z
      this.scene.initialRotation.y = this.config.camera.rotation.y

    } else {

      this.controlsContainer.position.x = 0
      this.controlsContainer.position.y = 0
      this.controlsContainer.position.z = 0
      this.controlsContainer.rotation.x = 0
      this.controlsContainer.rotation.y = 0
      this.controlsContainer.rotation.z = 0
      this.scene.camera.position.x = this.config.camera.position.x
      this.scene.camera.position.y = this.config.camera.position.y
      this.scene.camera.position.z = this.config.camera.position.z
      this.scene.camera.rotation.x = this.config.camera.rotation.x
      this.scene.camera.rotation.y = this.config.camera.rotation.y
      this.scene.camera.rotation.z = this.config.camera.rotation.z
      this.scene.initialRotation.y = this.config.camera.rotation.y

    }
    this.scene.setupPostProcessing( this.passes )
    // this.addGUI()
    this.fadeIn()

  }

  initPostProcessing() {

    this.boxBlurPass = new BoxBlurPass( this.config.postProcessing.boxBlurPass.x, this.config.postProcessing.boxBlurPass.y )
    this.vignettePass = new VignettePass( {
      boost: this.config.postProcessing.vignettePass.boost,
      reduction: this.config.postProcessing.vignettePass.reduction
    } )
    this.zoomBlurPass = new ZoomBlurPass( this.config.postProcessing.zoomBlurPass )
    this.multiPassBloomPass = new MultiPassBloomPass( this.config.postProcessing.multiPassBloomPass )
    this.passes = [ this.boxBlurPass, this.multiPassBloomPass, this.zoomBlurPass, this.vignettePass ]

  }

  addGUI() {

    this.beaubourg.addGUI()

    this.vignettePass.params.range = [ 0, 10 ]
    this.zoomBlurPass.params.range = [ 0, 2 ]
    this.multiPassBloomPass.params.range = [ 0, 5 ]

    GUI.panel
      .addGroup({ label: 'Post Processing', enable: false })
        .addSubGroup({ label: 'Vignette Pass' })
          .addSlider( this.vignettePass.params, 'boost', 'range', { step: 0.05 } )
          .addSlider( this.vignettePass.params, 'reduction', 'range', { step: 0.05 } )
        .addSubGroup({ label: 'Zoom Blur Pass' })
          .addSlider( this.zoomBlurPass.params, 'strength', 'range', { step: 0.05 } )
        .addSubGroup({ label: 'Multi Pass Bloom Pass' })
          .addSlider( this.multiPassBloomPass.params, 'blurAmount', 'range', { step: 0.05 } )
          .addSlider( this.multiPassBloomPass.params, 'zoomBlurStrength', 'range', { step: 0.05 } )

  }

  fadeIn() {

    this.fadeInTl = new TimelineMax()
    this.fadeInTl.fromTo( this.vignettePass.params, 3, { boost: 0 }, { boost: 1, delay: 1, ease: Sine.easeOut } )

  }

  update( time ) {

    for ( let obj of this.objects ) {

      obj.update( time )

    }

  }

  resize( newWidth, newHeight ) {

  }

}

export default DurasSong
