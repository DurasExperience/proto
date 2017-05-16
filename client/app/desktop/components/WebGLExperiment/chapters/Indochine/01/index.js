import { Group, Mesh, SphereBufferGeometry, MeshBasicMaterial } from 'three'
import Mountains from './Mountains'
import Floor from './Floor'
import Journey from './Journey'
import FloorPath from './FloorPath'
import Config from './Config'
import Store from './../../../../../../../flux/store/desktop/index'
import Actions from './../../../../../../../flux/actions'
import EventsConstants from './../../../../../../../flux/constants/EventsConstants'
import GUI from './../../../../../../../helpers/GUI'

import BoxBlurPass from '@superguigui/wagner/src/passes/box-blur/BoxBlurPass'
import VignettePass from '@superguigui/wagner/src/passes/vignette/VignettePass'
import ZoomBlurPass from '@superguigui/wagner/src/passes/zoom-blur/ZoomBlurPass'
import MultiPassBloomPass from '@superguigui/wagner/src/passes/bloom/MultiPassBloomPass'
import BlendPass from '@superguigui/wagner/src/passes/blend/BlendPass'
import GodrayPass from '@superguigui/wagner/src/passes/godray/godraypass'

class Indochine01 extends Group {

  constructor( scene, controlsContainer ) {

    super()

    this.name = 'indochine-01'
    this.scene = scene
    this.config = Config.indochine_01
    this.isAnimating = false

    this.bind()

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

    this.initPostProcessing()
    this.setupReverse()

  }

  bind() {

    [ 'resize', 'update', 'drown', 'reverse', 'fadeIn', 'fadeOut', 'play', 'clearGroup' ]
        .forEach( ( fn ) => this[ fn ] = this[ fn ].bind( this ) )

  }

  addListeners() {

    if ( Config.mobileConnect ) Store.socketRoom.on( 'pinch', this.reverse )
    else dom.event.on( window, 'click', this.reverse )

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
    this.addListeners()

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

  }

  addGUI() {

    this.mountains.addGUI()
    this.floor.addGUI()

    const postProcessingFolder = GUI.addFolder( 'Post Processing Ch1.1' )
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
    this.isAnimating = true
    this.scene.passes.push( this.godrayPass )
    this.drownTl = new TimelineMax({ onComplete: () => {

      this.isAnimating = false

    } })
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

    if( this.isAnimating ) return

    this.reverseTl.play( 0 )
    this.journey.reverse( 4 )
    this.floorPath.reverse( 4 )

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

    this.remove( this.journey )
    this.remove( this.floorPath )
    this.remove( this.mountains )
    this.remove( this.floor )
    this.passes = []
    this.scene.setupPostProcessing( this.passes )
    Actions.changeSubpage( '/indochine/02' )

  }


  update( time ) {

    for ( let obj of this.objects ) {

      obj.update( time )

    }

  }

  resize( newWidth, newHeight ) {

  }

}

export default Indochine01
