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
import BlendPass from 'avdp-wagner/src/passes/blend/BlendPass'
import GodrayPass from 'avdp-wagner/src/passes/godray/godraypass'

class DurasSong extends Group {

  constructor( scene, controlsContainer ) {

    super()
    this.name = 'indochine-02'
    this.scene = scene
    this.controlsContainer = controlsContainer
    this.config = Config
    this.bind()

    this.beaubourg = new Beaubourg()
    this.add( this.beaubourg )
    this.objects = [ this.beaubourg ]

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

    this.initPostProcessing()

  }

  bind() {

    [ 'resize', 'update', 'fadeOut', 'clearGroup' ]
      .forEach( ( fn ) => this[ fn ] = this[ fn ].bind( this ) )

  }


  start() {

    this.scene.setupPostProcessing( this.passes )
    this.addGUI()
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
    this.fadeInTl.fromTo( this.vignettePass.params, 2, { boost: 0 }, { boost: 1, ease: Sine.easeOut } )

  }

  fadeOut() {

    this.vignettePass.params.boost = this.config.postProcessing.vignettePass.boost
    this.vignettePass.params.reduction = this.config.postProcessing.vignettePass.reduction
    this.fadeOutTl = new TimelineMax({ onComplete: this.clearGroup })
    this.fadeOutTl.to( this.vignettePass.params, 2, { boost: 0, ease: Sine.easeOut } )

  }

  clearGroup() {

    // this.removeListeners()
    this.fadeInTl.clear()
    this.fadeOut.clear()
    this.remove( this.beaubourg )
    for ( let i = this.children.length - 1; i >= 0; i--) {
      const child = this.children[ i ]
      this.remove( child )
      ClearObject3D( child )
    }
    this.passes = []
    this.scene.setupPostProcessing( this.passes )
    this.objects = []

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
