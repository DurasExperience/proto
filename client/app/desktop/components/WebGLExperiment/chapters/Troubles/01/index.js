import { Group, Mesh, BufferGeometry, Geometry, BufferAttribute, GeometryUtils } from 'three'
import { troubles_01 as Config, splines as splinesConfig } from './Config'
import Buildings from './Buildings'
import LineSpline from './LineSpline'
import Walk from './Walk'
import GlobalConfig from '././../../../../../../../config'
import Store from './../../../../../../../flux/store/desktop/index'
import Actions from './../../../../../../../flux/actions'
import EventsConstants from './../../../../../../../flux/constants/EventsConstants'
import GUI from './../../../../../../../helpers/GUI'
import AudioManager from './../../../../../../../helpers/AudioManager'

import BoxBlurPass from 'avdp-wagner/src/passes/box-blur/BoxBlurPass'
import VignettePass from 'avdp-wagner/src/passes/vignette/VignettePass'
import MultiPassBloomPass from 'avdp-wagner/src/passes/bloom/MultiPassBloomPass'
import KaleidoscopePass from 'avdp-wagner/src/passes/kaleidoscope/KaleidoscopePass'

class Troubles01 extends Group {

  constructor( scene, controlsContainer ) {

    super()

    this.name = 'troubles-01'
    this.scene = scene
    this.config = Config
    

    this.bind()
    // this.scene.camera.position.z = 5000

    this.walk = new Walk( scene, controlsContainer, this.fadeOut )
    this.walk.init()
    this.walk.enableSpline()
    this.walk.update()
    if ( GlobalConfig.debug ) this.walk.createGeometry()
    this.buildings = new Buildings()
    this.add( this.buildings )
    this.objects = [ this.walk, this.buildings ]
    this.splines = []
    for ( let i = 0; i < splinesConfig.length; i++ ) {
      const spline = new LineSpline( splinesConfig[ i ], this.scene.camera )
      this.splines.push( spline )
      this.add( spline )
      this.objects.push( spline )
    }

    this.limit = this.walk.duration - 2

    this.initPostProcessing()
    this.setupTimeline()
    this.setupSound()

  }

  bind() {

    [ 'resize', 'update', 'fadeIn', 'fadeOut', 'play', 'clearGroup', 'mess', 'clean' ]
        .forEach( ( fn ) => this[ fn ] = this[ fn ].bind( this ) )

  }

  addListeners() {

    if ( GlobalConfig.mobileConnect ) Store.socketRoom.on( 'pinch', this.reverse )
    else {
      Store.on( EventsConstants.SPACE_DOWN, this.mess )
      Store.on( EventsConstants.SPACE_UP, this.clean )
    }

  }

  removeListeners() {

    if ( GlobalConfig.mobileConnect ) Store.socketRoom.off( 'pinch', this.reverse )
    else {
      Store.off( EventsConstants.SPACE_DOWN, this.mess )
      Store.off( EventsConstants.SPACE_UP, this.clean )
    }

  }

  start() {

    this.scene.setupPostProcessing( this.passes )
    // Store.on( EventsConstants.START_CHAPTER, this.play )
    this.addListeners()
    this.play()
    this.addGUI()

  }

  play() {

    // Store.off( EventsConstants.START_CHAPTER, this.play )
    this.walk.start()
    this.walk.play()

    this.ambientSoundId = this.ambientSound.play()
    this.drunkAmbientSoundId = this.drunkAmbientSound.play()
    this.ambientSound.fade( 0, 1, 300, this.ambientSoundId )

    this.timeout = setTimeout( () => { this.splines[ 0 ].start() }, 1500 )
    this.splinesTl.play()
    
  }

  initPostProcessing() {

    this.kaleidoscopePass = new KaleidoscopePass({
      sides: this.config.postProcessing.kaleidoscopePass.sides,
      angle: this.config.postProcessing.kaleidoscopePass.angle
    })
    this.boxBlurPass = new BoxBlurPass( this.config.postProcessing.boxBlurPass.x, this.config.postProcessing.boxBlurPass.y )
    this.vignettePass = new VignettePass( this.config.postProcessing.vignettePass )
    this.multiPassBloomPass = new MultiPassBloomPass( this.config.postProcessing.multiPassBloomPass )

    this.passes = [ this.boxBlurPass, this.multiPassBloomPass ]
    this.initPassesLength = this.passes.length

  }

  addGUI() {

    // this.buildings.addGUI()

    this.vignettePass.params.range = [ 0, 10 ]
    this.multiPassBloomPass.params.range = [ 0, 5 ]
    this.kaleidoscopePass.params.rangeSides = [ 0, 12 ]

    GUI.panel
      .addGroup({ label: 'Post Processing', enable: true })
        .addSubGroup({ label: 'Kaleidoscope Pass' })
          .addSlider( this.kaleidoscopePass.params, 'sides', 'rangeSides', { step: 1 } )
        .addSubGroup({ label: 'Vignette Pass' })
          .addSlider( this.vignettePass.params, 'boost', 'range', { step: 0.05 } )
          .addSlider( this.vignettePass.params, 'reduction', 'range', { step: 0.05 } )
        .addSubGroup({ label: 'Multi Pass Bloom Pass' })
          .addSlider( this.multiPassBloomPass.params, 'blurAmount', 'range', { step: 0.05 } )
          .addSlider( this.multiPassBloomPass.params, 'zoomBlurStrength', 'range', { step: 0.05 } )

  }

  setupTimeline() {

    this.splinesTl = new TimelineMax({ paused: true })
    for ( let i = 1; i < this.splines.length; i++ ) {
      this.splinesTl.add( () => { this.splines[ i ].start() }, this.config.timeDelay * i )

    }

  }

  setupSound() {

    this.ambientSound = AudioManager.get( '02_01_ambient' )
    this.drunkAmbientSound = AudioManager.get( '02_01_drunk_ambient' )

  }

  fadeIn() {

    this.fadeInTl = new TimelineMax()
    this.fadeInTl.to( this.vignettePass.params, 1, { boost: 1, ease: Sine.easeIn } )

  }

  mess() {
    
    const disableMess = Math.ceil( this.walk.time * this.walk.duration ) > this.limit
    if( disableMess ) return
    this.scene.passes.push( this.kaleidoscopePass )
    this.ambientSound.fade( 1, 0, 300, this.ambientSoundId )
    this.drunkAmbientSound.fade( 0, 1, 300, this.drunkAmbientSoundId )

  }

  clean() {

    this.scene.passes.pop()
    this.drunkAmbientSound.fade( 1, 0, 300, this.drunkAmbientSoundId )
    this.ambientSound.fade( 0, 1, 300, this.ambientSoundId )

  }

  fadeOut() {

    if ( this.scene.passes.length > this.initPassesLength ) this.scene.passes.pop()
    this.vignettePass.params.boost = this.config.postProcessing.vignettePass.boost
    this.vignettePass.params.reduction = this.config.postProcessing.vignettePass.reduction
    this.scene.passes.push( this.vignettePass )
    this.fadeOutTl = new TimelineMax({ onComplete: this.clearGroup })
    this.fadeOutTl.to( this.vignettePass.params, 2, { boost: 0, ease: Sine.easeOut } )

  }

  clearGroup() {

    this.removeListeners()
    clearTimeout( this.timeout )
    for ( let i = this.children.length - 1; i >= 0; i--) {
      this.remove( this.children[ i ] )
    }
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

    for ( let spline of this.splines ) {

      spline.resize( newWidth, newHeight )

    }

  }

}

export default Troubles01
