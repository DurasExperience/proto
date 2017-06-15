import { Group, Mesh, MeshBasicMaterial } from 'three'
import Mountains from './Mountains'
import Floor from './Floor'
import Journey from './Journey'
import FloorPath from './FloorPath'
import Config from './Config'
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

class Indochine01 extends Group {

  constructor( scene, controlsContainer ) {

    super()

    this.name = 'indochine-01'
    this.scene = scene
    this.config = Config.indochine_01
    this.level = 'surface'

    this.bind()

    this.mountains = new Mountains()
    this.floor = new Floor()
    this.journey = new Journey( scene, controlsContainer, this.fadeOut )
    this.floorPath = new FloorPath( scene, this.floor, this.journey.duration )
    this.journey.init()
    this.journey.enableSpline()
    this.journey.update()
    this.floorPath.init()
    this.floorPath.enableSpline()
    this.floorPath.update()

    if ( GlobalConfig.debug ) {

      this.journey.createGeometry()
      this.floorPath.createGeometry()

    }

    this.add( this.mountains )
    this.add( this.floor )
    this.objects = [ this.mountains, this.floor ]

    this.needFirstDrown = true
    this.limit = this.journey.duration - 2
    this.depth = 0.75

    this.lastDrown = setTimeout( this.drown, this.limit * 1000 )

    this.initPostProcessing()
    this.setupTimelines()
    this.setupSound()

  }

  bind() {

    [ 'resize', 'update', 'firstDrown', 'drown', 'ascend', 'fadeIn', 'fadeOut', 'play', 'clearGroup', 'clearAmbientSound' ]
        .forEach( ( fn ) => this[ fn ] = this[ fn ].bind( this ) )

  }

  addListeners() {

    if ( GlobalConfig.mobileConnect ) Store.socketRoom.on( 'pinch', this.reverse )
    else {
      Store.on( EventsConstants.SPACE_DOWN, this.ascend )
      Store.on( EventsConstants.SPACE_UP, this.drown )
      Store.on( EventsConstants.END_AMBIENT, this.clearAmbientSound )
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
    Store.on( EventsConstants.START_CHAPTER, this.play )
    this.addGUI()

  }

  play() {

    Store.off( EventsConstants.START_CHAPTER, this.play )
    this.objects.push( this.journey )
    this.objects.push( this.floorPath )
    this.journey.start()
    this.floorPath.start()
    this.journey.play()

    this.surfaceSoundId = this.journey.voiceId

    this.surfaceAmbientSoundId = this.surfaceAmbientSound.play()

    // this.surfaceSound.fade( 0, 1, 500, this.surfaceSoundId )
    this.surfaceAmbientSound.fade( 0, 1, 500, this.surfaceAmbientSoundId )

    this.firstDrown()

  }

  initPostProcessing() {

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

    this.passes = [ this.boxBlurPass, this.multiPassBloomPass, this.zoomBlurPass ]
    this.initPassesLength = this.passes.length

  }

  addGUI() {

    this.mountains.addGUI()
    this.floor.addGUI()

    this.vignettePass.params.range = [ 0, 10 ]
    this.zoomBlurPass.params.range = [ 0, 2 ]
    this.multiPassBloomPass.params.range = [ 0, 5 ]
    this.godrayPass.params.range = [ 0, 5 ]

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
        .addSubGroup({ label: 'Godray Pass' })
          .addSlider( this.godrayPass.params, 'fX', 'range', { step: 0.05 } )
          .addSlider( this.godrayPass.params, 'fY', 'range', { step: 0.05 } )
          .addSlider( this.godrayPass.params, 'fExposure', 'range', { step: 0.05 } )
          .addSlider( this.godrayPass.params, 'fDecay', 'range', { step: 0.05 } )
          .addSlider( this.godrayPass.params, 'fDensity', 'range', { step: 0.05 } )
          .addSlider( this.godrayPass.params, 'fWeight', 'range', { step: 0.05 } )

  }

  firstDrown() {

    this.underwaterSoundId = this.underwaterSound.play()
    this.underwaterAmbientSoundId = this.underwaterAmbientSound.play()

    this.firstDrownTimeout = setTimeout( () => {

      Actions.tutoDisplay( true )
      this.drown()

    }, 3000 )

  }

  setupSound() {

    this.surfaceSound = this.journey.voice
    this.underwaterSound = AudioManager.get( '01_01_voice_underwater' )
    this.surfaceAmbientSound = AudioManager.get( '01_01_ambient_surface' )
    this.underwaterAmbientSound = AudioManager.get( '01_01_ambient_underwater' )
  }

  drown() {

    // const disableDrown = Math.ceil( this.journey.time * this.journey.duration ) > this.limit
    // if( disableDrown ) return

    if ( this.scene.passes.length === this.initPassesLength ) this.scene.passes.push( this.godrayPass )

    this.drownTl.timeScale( this.depth )
    this.drownTl.play()

    this.surfaceSound.fade( 1, 0, 900, this.surfaceSoundId )
    this.surfaceAmbientSound.fade( 1, 0, 900, this.surfaceAmbientSoundId )

    this.underwaterSound.fade( 0, 1, 900, this.underwaterSoundId )
    this.underwaterAmbientSound.fade( 0, 0.5, 900, this.underwaterAmbientSoundId )

  }

  ascend() {

    const disableAscend = Math.ceil( this.journey.time * this.journey.duration ) > this.limit
    if( disableAscend ) return

    this.drownTl.timeScale( 1.5 )
    this.drownTl.reverse()

    this.underwaterSound.fade( 1, 0, 1000, this.underwaterSoundId )
    this.underwaterAmbientSound.fade( 1, 0, 1000, this.underwaterAmbientSoundId )

    this.surfaceSound.fade( 0, 1, 1300, this.surfaceSoundId )
    this.surfaceAmbientSound.fade( 0, 1, 1300, this.surfaceAmbientSoundId )

  }

  setupTimelines() {

    this.drownTl = new TimelineMax({
      paused: true,
      onComplete: () => {
        this.level = 'underwater'
        if ( this.needFirstDrown ) {
          this.addListeners()
          this.needFirstDrown = false
        }
      }
    })
    this.drownTl.fromTo( this.journey.shift, 3, { y: 0 }, { y: -80 }, 0 )
    this.drownTl.fromTo( this.mountains.mesh.uniforms.alpha, 0.5, { value: this.mountains.config.alpha }, { value: 0 }, 0 )
    this.drownTl.fromTo( this.godrayPass.params, 1, { fY: this.config.postProcessing.godrayPass.fY }, { fY: 1 }, 0 )
    this.drownTl.fromTo( this.godrayPass.params, 1, { fDecay: this.config.postProcessing.godrayPass.fDecay }, { fDecay: 0.91 }, 0 )
    this.drownTl.fromTo( this.godrayPass.params, 1, { fExposure: this.config.postProcessing.godrayPass.fExposure }, { fExposure: 0.27 }, 0 )
    this.drownTl.fromTo( this.godrayPass.params, 1, { fDensity: this.config.postProcessing.godrayPass.fDensity }, { fDensity: 0.6 }, 0.1 )
    this.drownTl.fromTo( this.godrayPass.params, 1, { fWeight: this.config.postProcessing.godrayPass.fWeight }, { fWeight: 0.3 }, 0.1 )
    this.drownTl.fromTo( this.floor.uniforms.size, 1, { value: this.floor.config.size }, { value: 30 }, 1 )
    this.drownTl.timeScale( 0.75 )

    this.drownTl.eventCallback( 'onReverseComplete', () => {
      if ( this.scene.passes.length > this.initPassesLength ) this.scene.passes.pop()
      this.level = 'surface'
    } )

  }

  fadeIn() {

    this.fadeInTl = new TimelineMax()
    this.fadeInTl.to( this.vignettePass.params, 1, { boost: 1, ease: Sine.easeIn } )

  }

  fadeOut() {

    // this.drown()
    this.vignettePass.params.boost = this.config.postProcessing.vignettePass.boost
    this.vignettePass.params.reduction = this.config.postProcessing.vignettePass.reduction
    this.scene.passes.push( this.vignettePass )
    this.fadeOutTl = new TimelineMax({ onComplete: this.clearGroup })
    this.fadeOutTl.to( this.vignettePass.params, 2, { boost: 0, ease: Sine.easeOut } )

  }

  clearGroup() {

    this.removeListeners()
    this.remove( this.journey )
    this.remove( this.floorPath )
    this.remove( this.mountains )
    this.remove( this.floor )
    this.passes = []
    this.scene.setupPostProcessing( this.passes )
    this.drownTl.clear()
    this.fadeOutTl.clear()
    clearTimeout( this.firstDrownTimeout )

    AudioManager.stop( '01_01_voice_surface' )
    this.surfaceSound.fade( 1, 0, 500, this.surfaceSoundId )
    this.surfaceAmbientSound.fade( 1, 0.5, 500, this.surfaceAmbientSoundId )

    this.underwaterSound.fade( 0.5, 0, 500, this.underwaterSoundId )
    this.underwaterAmbientSound.fade( 0.5, 0, 500, this.underwaterAmbientSoundId )

    setTimeout( () => {
      this.surfaceSound.stop()
      this.underwaterSound.stop()
      this.underwaterAmbientSound.stop()
      Actions.changeSubpage( '/indochine/02' )
    }, 300 )

  }

  clearAmbientSound(){

    this.surfaceAmbientSound.fade( 1, 0, 2500, this.surfaceAmbientSoundId )

    // setTimeout( () => {
    //
    //   this.surfaceAmbientSound.stop()
    //
    // }, 3000 )

  }


  update( time ) {

    for ( let obj of this.objects ) {

      obj.update( time )

    }

    // this.end = Math.ceil( this.journey.time * this.journey.duration ) > this.limit
    // if(this.end){
    //   this.depth = 0.1
    //   this.drown()
    // }

  }

  resize( newWidth, newHeight ) {

  }

}

export default Indochine01
