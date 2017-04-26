import { Group, Mesh, SphereBufferGeometry, MeshBasicMaterial } from 'three'
import Mountains from './Mountains'
import Floor from './Floor'
import Journey from './Journey'
import FloorPath from './FloorPath'
import HandWoman from './HandWoman'
import HandMan from './HandMan'
import Observer from './Observer'
import BoxBlurPass from '@superguigui/wagner/src/passes/box-blur/BoxBlurPass'
import VignettePass from '@superguigui/wagner/src/passes/vignette/VignettePass'
import ZoomBlurPass from '@superguigui/wagner/src/passes/zoom-blur/ZoomBlurPass'
import MultiPassBloomPass from '@superguigui/wagner/src/passes/bloom/MultiPassBloomPass'
import BlendPass from '@superguigui/wagner/src/passes/blend/BlendPass'
import GodrayPass from '@superguigui/wagner/src/passes/godray/godraypass'
import TiltShiftPass from '@superguigui/wagner/src/passes/tiltshift/tiltshiftPass'
import Config from './config'
import Store from './../../../../../../flux/store/desktop'
import EventsConstants from './../../../../../../flux/constants/EventsConstants'
import GUI from './../../../../../../helpers/GUI'

class Indochine extends Group {

  constructor( scene, controlsContainer ) {

    super()

    this.name = 'indochine'
    this.scene = scene
    this.config = Config

    this.bind()

    this.progress = 0

    // Part 1
    this.mountains = new Mountains()
    this.floor = new Floor()
    this.journey = new Journey( scene, controlsContainer, this.drown, this.fadeOut )
    this.floorPath = new FloorPath( scene, this.floor, this.journey.duration )
    this.journey.init()
    this.journey.enableSpline()
    this.journey.update()
    this.floorPath.init()
    this.floorPath.enableSpline()
    this.floorPath.update()

    //   this.journey.createGeometry()
    //   this.floorPath.createGeometry()
    this.add( this.mountains )
    this.add( this.floor )
    this.objects = [ this.mountains, this.floor ]

    // Part 2
    // const m = new Mesh(
    //   new SphereBufferGeometry( 30, 16, 16 ),
    //   new MeshBasicMaterial({ color: 0xffffff })
    // )
    // this.add( m )
    this.observer = new Observer( scene, controlsContainer, this.fadeOut )
    this.handWoman = new HandWoman( this.observer.duration )
    this.handMan = new HandMan( this.observer.duration )
    

    this.initPostProcessing()
    this.addGUI()

    this.setupReverse()


  }

  bind() {

    [ 'resize', 'update', 'drown', 'reverse', 'fadeIn', 'fadeOut', 'play', 'clearGroup' ]
        .forEach( ( fn ) => this[ fn ] = this[ fn ].bind( this ) )

  }

  addListeners() {

    // dom.event.on( window, 'click', this.reverse )
    Store.socketRoom.on( 'pinch', this.reverse )
    // global.play = this.play
    // global.drown = this.drown
    // global.reverse = this.reverse

  }

  start() {

    console.log( 'start ch1' )
    // console.log( Store.socketRoom )
    Store.on( EventsConstants.START_CHAPTER, this.play )

  }

  play() {

    Store.off( EventsConstants.START_CHAPTER, this.play )
    this.journey.start()
    this.floorPath.start()
    this.journey.play()
    this.objects.push( this.journey )
    this.objects.push( this.floorPath )
    this.addListeners()

  }

  initPostProcessing() {

    this.boxBlurPass = new BoxBlurPass( this.config.postProcessing.boxBlurPass.x, this.config.postProcessing.boxBlurPass.y )
    this.vignettePass = new VignettePass({ boost: 1, reduction: 0 })
    this.zoomBlurPass = new ZoomBlurPass( this.config.postProcessing.zoomBlurPass )
    this.multiPassBloomPass = new MultiPassBloomPass( this.config.postProcessing.multiPassBloomPass )
    this.tiltShiftPass = new TiltShiftPass( this.config.postProcessing.tiltShiftPass )
    this.godrayPass = new GodrayPass()
    this.godrayPass.params.fY = this.config.postProcessing.godrayPass.fY
    this.godrayPass.params.fDecay = this.config.postProcessing.godrayPass.fDecay
    this.godrayPass.params.fDensity = this.config.postProcessing.godrayPass.fDensity
    this.godrayPass.params.fWeight = this.config.postProcessing.godrayPass.fWeight
    this.godrayPass.params.fExposure = this.config.postProcessing.godrayPass.fExposure
    this.passes = [ this.boxBlurPass, this.multiPassBloomPass, this.zoomBlurPass ]

    this.scene.setupPostProcessing( this.passes )

  }

  addGUI() {

    const postProcessingFolder = GUI.addFolder( 'Post Processing' )
    postProcessingFolder.open()
    const vignettePassFolder = postProcessingFolder.addFolder( 'Vignette Pass' )
    vignettePassFolder.add( this.vignettePass.params, 'boost' ).min( 0 ).max( 10 ).step( 0.05 )
    vignettePassFolder.add( this.vignettePass.params, 'reduction' ).min( 0 ).max( 10 ).step( 0.05 )
    vignettePassFolder.open()
    const zoomBlurPassFolder = postProcessingFolder.addFolder( 'Zoom Blur Pass' )
    zoomBlurPassFolder.add( this.zoomBlurPass.params, 'strength' ).min( 0 ).max( 2 ).step( 0.05 )
    zoomBlurPassFolder.open()
    const multiPassBloomPassFolder = postProcessingFolder.addFolder( 'Multi Pass Bloom Pass' )
    multiPassBloomPassFolder.add( this.multiPassBloomPass.params, 'blurAmount' ).min( 0 ).max( 5 ).step( 0.05 )
    multiPassBloomPassFolder.add( this.multiPassBloomPass.params, 'zoomBlurStrength' ).min( 0 ).max( 5 ).step( 0.05 )
    multiPassBloomPassFolder.open()
    const godrayPassFolder = postProcessingFolder.addFolder( 'Godray Pass' )
    godrayPassFolder.add( this.godrayPass.params, 'fX' ).min( 0 ).max( 1 ).step( 0.05 )
    godrayPassFolder.add( this.godrayPass.params, 'fY' ).min( 0 ).max( 1 ).step( 0.05 )
    godrayPassFolder.add( this.godrayPass.params, 'fExposure' ).min( 0 ).max( 5 ).step( 0.05 )
    godrayPassFolder.add( this.godrayPass.params, 'fDecay' ).min( 0 ).max( 5 ).step( 0.05 )
    godrayPassFolder.add( this.godrayPass.params, 'fDensity' ).min( 0 ).max( 5 ).step( 0.05 )
    godrayPassFolder.add( this.godrayPass.params, 'fWeight' ).min( 0 ).max( 5 ).step( 0.05 )
    godrayPassFolder.open()

  }

  drown() {
    
    // TODO : Remove Store event on pinch
    this.scene.passes.push( this.godrayPass )
    this.drownTl = new TimelineMax()
    this.drownTl.to( this.godrayPass.params, 1, { fY: 1 }, 0 )
    this.drownTl.to( this.mountains.mesh.uniforms.alpha, 1.5, { value: 0 }, 0 )
    this.drownTl.to( this.godrayPass.params, 1, { fDecay: 0.91 }, 0 )
    this.drownTl.to( this.godrayPass.params, 1, { fExposure: 0.27 }, 0 )
    this.drownTl.to( this.godrayPass.params, 1, { fDensity: 0.6 }, 0.1 )
    this.drownTl.to( this.godrayPass.params, 1, { fWeight: 0.3 }, 0.1 )
    this.drownTl.to( this.floor.uniforms.size, 1, { value: 30 }, 1 )
    this.drownTl.timeScale( 0.5 )

  }

  setupReverse() {

    this.reverseTl = new TimelineMax({ paused: true })
    this.reverseTl.to( this.zoomBlurPass.params, 1, { strength: 0.35 }, 0 )
    this.reverseTl.to( this.zoomBlurPass.params, 0.5, { strength: 0.0025 }, 1.2 )
    this.reverseTl.timeScale( 2 )

  }

  reverse() {

    this.reverseTl.play( 0 )
    switch( this.progress ) {

      case 0:
        this.journey.reverse( 4 )
        this.floorPath.reverse( 4 )
        break

      case 1:
        this.observer.reverse( 4 )
        this.handWoman.reverse( 4 )
        this.handMan.reverse( 4 )
        break

    }

  }

  fadeIn() {

    this.fadeInTl = new TimelineMax()
    this.fadeInTl.to( this.vignettePass.params, 1, { boost: 1, ease: Sine.easeIn } )
  
  }
  
  fadeOut() {

    this.vignettePass.params.boost = this.config.postProcessing.vignettePass.boost
    this.vignettePass.params.reduction = this.config.postProcessing.vignettePass.reduction
    this.scene.passes.push( this.vignettePass )
    this.fadeOutTl = new TimelineMax({ onComplete: this.clearGroup })
    this.fadeOutTl.to( this.vignettePass.params, 2, { boost: 0, ease: Sine.easeOut } )
  
  }

  clearGroup() {

    switch( this.progress ) {

      case 0:
        this.remove( this.mountains )
        this.remove( this.floor )
        this.passes = [ this.boxBlurPass, this.multiPassBloomPass, this.zoomBlurPass ]
        this.scene.setupPostProcessing( this.passes )
        this.add( this.handWoman )
        this.add( this.handMan )
        // this.observer.createGeometry()
        this.objects = [ this.handWoman, this.handMan, this.observer ]
        this.fadeIn()
        this.observer.init()
        this.observer.enableSpline()
        this.observer.start()
        this.handWoman.init()
        this.handMan.init()
        this.progress = 1

    }


  }


  update( time ) {

    for ( let obj of this.objects ) {

      obj.update( time )

    }

  }

  resize( newWidth, newHeight ) {

  }

}

export default Indochine