import { Group } from 'three'
import Mountains from './Mountains'
import Floor from './Floor'
import Journey from './Journey'
import FloorPath from './FloorPath'
import BoxBlurPass from '@superguigui/wagner/src/passes/box-blur/BoxBlurPass'
import VignettePass from '@superguigui/wagner/src/passes/vignette/VignettePass'
import ZoomBlurPass from '@superguigui/wagner/src/passes/zoom-blur/ZoomBlurPass'
import MultiPassBloomPass from '@superguigui/wagner/src/passes/bloom/MultiPassBloomPass'
import BlendPass from '@superguigui/wagner/src/passes/blend/BlendPass'
import GodrayPass from '@superguigui/wagner/src/passes/godray/godraypass'
import TiltShiftPass from '@superguigui/wagner/src/passes/tiltshift/tiltshiftPass'
import Config from './config'
import GUI from './../../../../../../helpers/GUI'

class Indochine extends Group {

  constructor( scene, controlsContainer ) {

    super()

    this.name = 'indochine'
    this.scene = scene
    this.config = Config

    this.bind()
    this.addListeners()

    this.mountains = new Mountains()
    this.floor = new Floor()
    this.journey = new Journey( scene, controlsContainer )
    this.floorPath = new FloorPath( scene, this.floor, this.journey.duration )
    this.journey.init()
    this.journey.createGeometry()
    this.journey.enableSpline()
    this.floorPath.init()
    this.floorPath.createGeometry()
    this.floorPath.enableSpline()

    this.add( this.mountains )
    this.add( this.floor )

    this.initPostProcessing()
    this.addGUI()



  }

  bind() {

    [ 'resize', 'update', 'drown' ]
        .forEach( ( fn ) => this[ fn ] = this[ fn ].bind( this ) )

  }

  addListeners() {

    global.drown = this.drown

  }

  initPostProcessing() {

    this.godrayPass = new GodrayPass( this.config.postProcessing.godrayPass )
    this.boxBlurPass = new BoxBlurPass( this.config.postProcessing.boxBlurPass.x, this.config.postProcessing.boxBlurPass.y )
    this.vignettePass = new VignettePass( this.config.postProcessing.vignettePass )
    this.zoomBlurPass = new ZoomBlurPass( this.config.postProcessing.zoomBlurPass )
    this.multiPassBloomPass = new MultiPassBloomPass( this.config.postProcessing.multiPassBloomPass )
    this.tiltShiftPass = new TiltShiftPass( this.config.postProcessing.tiltShiftPass )
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

    this.passes.push( this.godrayPass )
    this.drownTl = new TimelineMax()
    this.drownTl.fromTo( this.godrayPass.params, 1, { fY: 0.5 }, { fY: 1 }, 0 )
    this.drownTl.fromTo( this.godrayPass.params, 1, { fDensity: 0 }, { fDensity: 0.6 }, 0 )
    this.drownTl.fromTo( this.godrayPass.params, 1, { fWeight: 0 }, { fWeight: 0.3 }, 0 )
    this.drownTl.to( this.mountains.mesh.uniforms.alpha, 1, { value: 0 }, 0.5 )
    this.drownTl.to( this.floor.uniforms.size, 1, { value: 50 }, 0.5 )
    this.drownTl.timeScale( 0.5 )

  }


  update( time ) {

    this.mountains.update( time )
    this.floor.update( time )
    this.journey.update()
    this.floorPath.update()

  }

  resize( newWidth, newHeight ) {

  }

}

export default Indochine