import { Group, Mesh, BufferGeometry, Geometry, BufferAttribute, GeometryUtils } from 'three'
import { troubles_01 as Config } from './Config'
import Buildings from './Buildings'
import GlobalConfig from '././../../../../../../../config'
import Store from './../../../../../../../flux/store/desktop/index'
import Actions from './../../../../../../../flux/actions'
import EventsConstants from './../../../../../../../flux/constants/EventsConstants'
import GUI from './../../../../../../../helpers/GUI'
import AudioManager from './../../../../../../../helpers/AudioManager'

import BoxBlurPass from 'avdp-wagner/src/passes/box-blur/BoxBlurPass'
import VignettePass from 'avdp-wagner/src/passes/vignette/VignettePass'
import ZoomBlurPass from 'avdp-wagner/src/passes/zoom-blur/ZoomBlurPass'
import MultiPassBloomPass from 'avdp-wagner/src/passes/bloom/MultiPassBloomPass'
import BlendPass from 'avdp-wagner/src/passes/blend/BlendPass'
import GodrayPass from 'avdp-wagner/src/passes/godray/godraypass'
import KaleidoscopePass from 'avdp-wagner/src/passes/kaleidoscope/KaleidoscopePass'

class Troubles01 extends Group {

  constructor( scene, controlsContainer ) {

    super()

    this.name = 'troubles-01'
    this.scene = scene
    this.config = Config

    this.bind()
    this.scene.camera.position.z = 5000

    this.buildings = new Buildings()
    this.add( this.buildings )
    this.objects = [ this.buildings ]


    this.initPostProcessing()
    // this.setupSound()

  }

  bind() {

    [ 'resize', 'update', 'fadeIn', 'fadeOut', 'play', 'clearGroup' ]
        .forEach( ( fn ) => this[ fn ] = this[ fn ].bind( this ) )

  }

  addListeners() {

    if ( GlobalConfig.mobileConnect ) Store.socketRoom.on( 'pinch', this.reverse )
    else {
      Store.on( EventsConstants.SPACE_DOWN, this.ascend )
      Store.on( EventsConstants.SPACE_UP, this.drown )
    }

  }

  removeListeners() {

    if ( GlobalConfig.mobileConnect ) Store.socketRoom.off( 'pinch', this.reverse )
    else {
      Store.off( EventsConstants.SPACE_DOWN, this.ascend )
      Store.off( EventsConstants.SPACE_UP, this.drown )
    }

  }

  start() {

    this.scene.setupPostProcessing( this.passes )
    // Store.on( EventsConstants.START_CHAPTER, this.play )
    // this.addListeners()
    this.play()
    this.addGUI()

  }

  play() {

    // Store.off( EventsConstants.START_CHAPTER, this.play )
    
  }
  initPostProcessing() {

    this.kaleidoscopePass = new KaleidoscopePass({
      sides: this.config.postProcessing.kaleidoscopePass.sides,
      angle: this.config.postProcessing.kaleidoscopePass.angle
    })
    this.boxBlurPass = new BoxBlurPass( this.config.postProcessing.boxBlurPass.x, this.config.postProcessing.boxBlurPass.y )
    this.vignettePass = new VignettePass( this.config.postProcessing.vignettePass )
    this.zoomBlurPass = new ZoomBlurPass( this.config.postProcessing.zoomBlurPass )
    this.multiPassBloomPass = new MultiPassBloomPass( this.config.postProcessing.multiPassBloomPass )
    this.godrayPass = new GodrayPass()
    this.godrayPass.params.fY = this.config.postProcessing.godrayPass.fY
    this.godrayPass.params.fDecay = this.config.postProcessing.godrayPass.fDecay
    this.godrayPass.params.fDensity = this.config.postProcessing.godrayPass.fDensity
    this.godrayPass.params.fWeight = this.config.postProcessing.godrayPass.fWeight
    this.godrayPass.params.fExposure = this.config.postProcessing.godrayPass.fExposure

    this.passes = [ this.kaleidoscopePass, this.boxBlurPass, this.multiPassBloomPass, this.zoomBlurPass ]
    this.initPassesLength = this.passes.length

  }

  addGUI() {

    this.buildings.addGUI()

    // this.vignettePass.params.range = [ 0, 10 ]
    // this.zoomBlurPass.params.range = [ 0, 2 ]
    // this.multiPassBloomPass.params.range = [ 0, 5 ]
    // this.godrayPass.params.range = [ 0, 5 ]
    this.kaleidoscopePass.params.rangeSides = [ 0, 12 ]

    GUI.panel
      .addGroup({ label: 'Post Processing', enable: true })
        .addSubGroup({ label: 'Kaleidoscope Pass' })
          .addSlider( this.kaleidoscopePass.params, 'sides', 'rangeSides', { step: 1 } )
    //     .addSubGroup({ label: 'Vignette Pass' })
    //       .addSlider( this.vignettePass.params, 'boost', 'range', { step: 0.05 } )
    //       .addSlider( this.vignettePass.params, 'reduction', 'range', { step: 0.05 } )
    //     .addSubGroup({ label: 'Zoom Blur Pass' })
    //       .addSlider( this.zoomBlurPass.params, 'strength', 'range', { step: 0.05 } )
    //     .addSubGroup({ label: 'Multi Pass Bloom Pass' })
    //       .addSlider( this.multiPassBloomPass.params, 'blurAmount', 'range', { step: 0.05 } )
    //       .addSlider( this.multiPassBloomPass.params, 'zoomBlurStrength', 'range', { step: 0.05 } )
    //     .addSubGroup({ label: 'Godray Pass' })
    //       .addSlider( this.godrayPass.params, 'fX', 'range', { step: 0.05 } )
    //       .addSlider( this.godrayPass.params, 'fY', 'range', { step: 0.05 } )
    //       .addSlider( this.godrayPass.params, 'fExposure', 'range', { step: 0.05 } )
    //       .addSlider( this.godrayPass.params, 'fDecay', 'range', { step: 0.05 } )
    //       .addSlider( this.godrayPass.params, 'fDensity', 'range', { step: 0.05 } )
    //       .addSlider( this.godrayPass.params, 'fWeight', 'range', { step: 0.05 } )

  }

  setupSound() {

    this.underwaterSound = AudioManager.get( '01_01_underwater' )
    this.underwaterAmbientSound = AudioManager.get( '01_01_underwater_ambient' )
    this.surfaceSound = AudioManager.get( '01_01_surface' )
    this.surfaceAmbientSound = AudioManager.get( '01_01_surface_ambient' )

  }

  fadeIn() {

    this.fadeInTl = new TimelineMax()
    this.fadeInTl.to( this.vignettePass.params, 1, { boost: 1, ease: Sine.easeIn } )

  }

  fadeOut() {

    this.drown()
    this.vignettePass.params.boost = this.config.postProcessing.vignettePass.boost
    this.vignettePass.params.reduction = this.config.postProcessing.vignettePass.reduction
    this.scene.passes.push( this.vignettePass )
    this.fadeOutTl = new TimelineMax({ onComplete: this.clearGroup })
    this.fadeOutTl.to( this.vignettePass.params, 2, { boost: 0, ease: Sine.easeOut } )

  }

  clearGroup() {

    this.removeListeners()
    this.passes = []
    this.scene.setupPostProcessing( this.passes )
    Actions.changeSubpage( '/troubles/02' )

  }


  update( time ) {

    for ( let obj of this.objects ) {

      obj.update( time )

    }

  }

  resize( newWidth, newHeight ) {

  }

}

export default Troubles01
