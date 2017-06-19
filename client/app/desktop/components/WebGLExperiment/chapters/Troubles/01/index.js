import { Group, Mesh, BufferGeometry, Geometry, BufferAttribute, GeometryUtils } from 'three'
import { troubles_01 as Config, linesSplines as linesSplinesConfig, arcSplines as arcSplinesConfig } from './Config'
import Buildings from './Buildings'
import Rails from './Rails'
import LineSpline from './LineSpline'
import ArcSpline from './ArcSpline'
import Walk from './Walk'
import GlobalConfig from '././../../../../../../../config'
import Store from './../../../../../../../flux/store/desktop/index'
import Actions from './../../../../../../../flux/actions'
import EventsConstants from './../../../../../../../flux/constants/EventsConstants'
import GUI from './../../../../../../../helpers/GUI'
import AudioManager from './../../../../../../../helpers/AudioManager'
import ClearObject3D from './../../../utils/ClearObject3D'
import Numbers from './../../../utils/Numbers'

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

    this.LEVEL = 'buildings'
    this.STATE = 'clean'

    this.bind()
    this.buildings = new Buildings()
    this.add( this.buildings )

    this.walk = new Walk( scene, controlsContainer, this.fadeOut )
    this.walk.init()
    this.walk.enableSpline()
    this.walk.update()
    if ( GlobalConfig.debug ) this.walk.createGeometry()
    this.objects = [ this.buildings, this.walk ]
    this.linesSplines = []
    for ( let i = 0; i < linesSplinesConfig.length; i++ ) {
      const spline = new LineSpline( i, linesSplinesConfig[ i ], this.scene.camera, controlsContainer )
      this.linesSplines.push( spline )
      this.add( spline )
      this.objects.push( spline )
    }
    this.arcSplines = []
    for ( let i = 0; i < arcSplinesConfig.length; i++ ) {
      const spline = new ArcSpline( i, arcSplinesConfig[ i ], this.scene.camera, controlsContainer )
      this.arcSplines.push( spline )
      this.add( spline )
      this.objects.push( spline )
    }
    this.rails = new Rails()
    this.limit = this.walk.duration - 12

    this.initPostProcessing()
    this.setupTimelines()
    this.setupSound()

  }

  bind() {

    [ 'resize', 'update', 'fadeOut', 'play', 'clearGroup', 'mess', 'clean', 'forceMess' ]
        .forEach( ( fn ) => this[ fn ] = this[ fn ].bind( this ) )

  }

  addListeners() {

    if ( GlobalConfig.mobileConnect ) {
      Store.socketRoom.on( EventsConstants.PRESS_START, this.mess )
      Store.socketRoom.on( EventsConstants.PRESS_END, this.clean )
    }
    else {
      Store.on( EventsConstants.SPACE_DOWN, this.mess )
      Store.on( EventsConstants.SPACE_UP, this.clean )
    }

  }

  removeListeners() {

    if ( GlobalConfig.mobileConnect ) {
      Store.socketRoom.off( EventsConstants.PRESS_START, this.mess )
      Store.socketRoom.off( EventsConstants.PRESS_END, this.clean )
    }
    else {
      Store.off( EventsConstants.SPACE_DOWN, this.mess )
      Store.off( EventsConstants.SPACE_UP, this.clean )
    }

  }

  start() {

    this.scene.setupPostProcessing( this.passes )
    Store.on( EventsConstants.START_CHAPTER, this.play )
    this.fadeIn()
    // this.play()
    // this.addGUI()

  }

  play() {

    Store.off( EventsConstants.START_CHAPTER, this.play )
    setTimeout(() => { Actions.tutoDisplay( true ) }, 1000)

    this.addListeners()
    this.walk.start()
    this.walk.play()

    this.ambientSoundId = this.ambientSound.play()
    this.drunkAmbientSoundId = this.drunkAmbientSound.play()
    this.ambientSound.fade( 0, 1, 300, this.ambientSoundId )
    // this.timeout = setTimeout( () => { this.linesSplines[ 0 ].start() }, 3500 )
    this.linesSplinesTimeout = setTimeout( () => { this.linesSplinesTlOut.play() }, 10 * 1000 )
    this.messTimeout = setTimeout( this.forceMess, this.limit * 1000 )
    this.linesSplinesTlIn.play()


  }

  initPostProcessing() {

    this.kaleidoscopePass = new KaleidoscopePass({
      sides: this.config.postProcessing.kaleidoscopePass.sides,
      angle: this.config.postProcessing.kaleidoscopePass.angle
    })
    this.boxBlurPass = new BoxBlurPass( this.config.postProcessing.boxBlurPass.x, this.config.postProcessing.boxBlurPass.y )
    this.multiPassBloomPass = new MultiPassBloomPass( this.config.postProcessing.multiPassBloomPass )
    this.vignettePass = new VignettePass( {
      boost: this.config.postProcessing.vignettePass.boost,
      reduction: this.config.postProcessing.vignettePass.reduction
    } )
    this.passes = [ this.boxBlurPass, this.multiPassBloomPass, this.vignettePass ]
    this.initPassesLength = this.passes.length

  }

  addGUI() {

    // this.buildings.addGUI()
    this.rails.addGUI()

    this.multiPassBloomPass.params.range = [ 0, 5 ]
    this.kaleidoscopePass.params.rangeSides = [ 0, 12 ]

    GUI.panel
      .addGroup({ label: 'Post Processing', enable: false })
        .addSubGroup({ label: 'Kaleidoscope Pass' })
          .addSlider( this.kaleidoscopePass.params, 'sides', 'rangeSides', { step: 1 } )
        .addSubGroup({ label: 'Multi Pass Bloom Pass' })
          .addSlider( this.multiPassBloomPass.params, 'blurAmount', 'range', { step: 0.05 } )
          .addSlider( this.multiPassBloomPass.params, 'zoomBlurStrength', 'range', { step: 0.05 } )

  }

  setupTimelines() {

    this.linesSplinesTlIn = new TimelineMax({ paused: true, delay: 2 })
    for ( let i = 0; i < this.linesSplines.length; i++ ) {
      this.linesSplinesTlIn.add( () => { this.linesSplines[ i ].start() }, 0.7 * i )
    }

    this.arcSplinesTlIn = new TimelineMax({ paused: true })
    for ( let i = 0; i < this.arcSplines.length; i++ ) {
      const delay = ( 0.5 * i ) - ( 0.3 * i )
      this.arcSplinesTlIn.add( () => { this.arcSplines[ i ].start() }, delay )
    }

    this.linesSplinesTlOut = new TimelineMax({
      paused: true,
      onComplete: () => {
        this.swapTl.play()
      }
    })
    for ( let i = 1; i < this.linesSplines.length - 1; i++ ) {
      this.linesSplinesTlOut.to( this.linesSplines[ i ].mesh.material.uniforms.opacity, 3, { value: 0, ease: Expo.easeOut }, i * 0.1 )
    }
    this.linesSplinesTlOut.add( () => { this.addRails() }, 0.1 )

    this.swapTl = new TimelineMax({
      paused: true,
      onComplete: () => {
        this.arcSplinesTlIn.play()
        this.swapClear()
        this.LEVEL = 'rails'
        if ( this.STATE === 'mess' ) this.scene.camera.rotation.x = -1.89
      }
    })
    this.swapTl.to( this.buildings.position, 1.5, { y: -1000, ease: Expo.easeIn }, 0 )
    this.swapTl.to( this.buildings.mesh.uniforms.alpha, 1.5, { value: 0 }, 0.1 )


    this.fadeOutTl = new TimelineMax({ paused: true, onComplete: this.clearGroup })
    this.fadeOutTl.to( this.vignettePass.params, 2, { boost: 0, ease: Sine.easeOut }, 0 )

  }

  setupSound() {

    this.ambientSound = AudioManager.get( '02_01_ambient' )
    this.drunkAmbientSound = AudioManager.get( '02_01_drunk_ambient' )

  }

  mess() {

    if ( this.STATE === 'forceMess' ) {
      const side = Math.random() > 0.5 ? -1 : 1
      const random = {
        x: this.scene.camera.rotation.x + Numbers.randomInRange( -0.25, 0.25 ),
        z: this.scene.camera.rotation.z + Numbers.randomInRange( -0.25, 0.25 )
      }
      this.kaleidoscopePass.params.sides += side
      TweenMax.to( this.kaleidoscopePass.params, 0.5, { angle: Numbers.randomInRange( -Math.PI, Math.PI ) } )
      TweenMax.to( this.scene.camera.rotation, 0.5, { x: random.x, z: random.z } )

    } else {

      this.scene.passes.push( this.kaleidoscopePass )
      this.ambientSound.fade( 1, 0, 300, this.ambientSoundId )
      this.drunkAmbientSound.fade( 0, 1, 300, this.drunkAmbientSoundId )
      if ( this.LEVEL === 'rails' ) this.scene.camera.rotation.x = -1.89
      this.STATE = 'mess'

    }

  }

  clean() {

    if ( this.STATE === 'forceMess' ) return
    this.scene.passes.pop()
    this.drunkAmbientSound.fade( 1, 0, 300, this.drunkAmbientSoundId )
    this.ambientSound.fade( 0, 1, 300, this.ambientSoundId )
    if ( this.LEVEL === 'rails' ) this.scene.camera.rotation.x = 1
    this.STATE = 'clean'

  }

  forceMess() {

    this.vignettePass.params.boost = this.config.postProcessing.vignettePass.boost
    this.vignettePass.params.reduction = this.config.postProcessing.vignettePass.reduction
    // this.scene.passes.push( this.vignettePass )
    this.forceMessTl = new TimelineMax()
    this.forceMessTl.to( this.vignettePass.params, 1, { boost: 0, ease: Sine.easeOut } )
    this.forceMessTl.add( () => {
      this.mess()
      this.STATE = 'forceMess'
      this.kaleidoscopePass.params.sides = this.config.postProcessing.kaleidoscopePass.sides + 2
      this.scene.camera.rotation.x = -2
      this.scene.camera.rotation.z = 0.58
    } )
    this.forceMessTl.to( this.vignettePass.params, 1, { boost: this.config.postProcessing.vignettePass.boost, ease: Sine.easeOut } )

  }

  swapClear() {

    // Clear buildings
    this.objects.shift()
    this.remove( this.buildings )
    ClearObject3D( this.buildings )

    // Clear lines 1 to max - 1
    for ( let i = 1; i < linesSplinesConfig.length - 1; i++ ) {
      const spline = this.linesSplines[ 0 ]
      this.objects.splice( 1, 1 )
      this.linesSplines.shift()
      this.remove( spline )
      ClearObject3D( spline )
    }


  }

  addRails() {

    this.add( this.rails )
    this.objects.push( this.rails )
    this.rails.transitionIn()

  }

  fadeIn() {

    this.fadeInTl = new TimelineMax()
    this.fadeInTl.fromTo( this.vignettePass.params, 2, { boost: 0 }, { boost: 1, ease: Sine.easeOut } )

  }

  fadeOut() {

    // if ( this.scene.passes.length > this.initPassesLength + 1 ) this.scene.passes.pop()
    this.vignettePass.params.boost = this.config.postProcessing.vignettePass.boost
    this.vignettePass.params.reduction = this.config.postProcessing.vignettePass.reduction
    // this.scene.passes.push( this.vignettePass )
    this.ambientSound.stop()
    this.drunkAmbientSound.fade( 1, 0, 1000, this.drunkAmbientSoundId )
    this.fadeOutTl.play()

  }

  clearGroup() {

    this.removeListeners()
    clearTimeout( this.timeout )
    clearTimeout( this.linesSplinesTimeout )
    for ( let i = this.children.length - 1; i >= 0; i--) {
      const child = this.children[ i ]
      this.remove( child )
      ClearObject3D( child )
    }
    this.objects = []
    this.walk.clear()
    this.fadeInTl.clear()
    this.fadeOutTl.clear()
    this.linesSplinesTlIn.clear()
    this.linesSplinesTlOut.clear()
    this.arcSplinesTlIn.clear()
    clearTimeout( this.timeout )
    clearTimeout( this.linesSplinesTimeout )
    clearTimeout( this.messTimeout )
    this.passes = []
    this.scene.setupPostProcessing( this.passes )
    Actions.changeSubpage( '/duras-song' )

  }


  update( time ) {

    for ( let obj of this.objects ) {

      obj.update( time )

    }

  }

  resize( newWidth, newHeight ) {

    for ( let spline of this.linesSplines ) {

      spline.resize( newWidth, newHeight )

    }

  }

}

export default Troubles01
