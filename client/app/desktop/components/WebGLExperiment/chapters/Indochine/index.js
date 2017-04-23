import { Group } from 'three'
import Mountains from './Mountains'
import Floor from './Floor'
import Journey from './Journey'
import FloorPath from './FloorPath'
import BoxBlurPass from '@superguigui/wagner/src/passes/box-blur/BoxBlurPass'
import VignettePass from '@superguigui/wagner/src/passes/vignette/VignettePass'
import ZoomBlurPass from '@superguigui/wagner/src/passes/zoom-blur/ZoomBlurPass'
import Config from './config'
import GUI from './../../../../../../helpers/GUI'

class Indochine extends Group {

  constructor( scene, controlsContainer ) {

    super()

    this.scene = scene
    this.config = Config

    this.initPostProcessing()
    this.addGUI()

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


  }

  initPostProcessing() {

    this.boxBlurPass = new BoxBlurPass( this.config.postProcessing.boxBlurPass.x, this.config.postProcessing.boxBlurPass.y )
    this.vignettePass = new VignettePass( this.config.postProcessing.vignettePass )
    this.zoomBlurPass = new ZoomBlurPass( this.config.postProcessing.zoomBlurPass )
    this.passes = [ this.boxBlurPass, this.vignettePass, this.zoomBlurPass ]

    this.scene.setupPostProcessing( this.passes )

  }

  addGUI() {

    const postProcessingFolder = GUI.addFolder( 'Post Processing' )
    // postProcessingFolder.open()
    const vignettePassFolder = postProcessingFolder.addFolder( 'Vignette Pass' )
    vignettePassFolder.add( this.vignettePass.params, 'boost' ).min( 0 ).max( 10 ).step( 0.05 )
    vignettePassFolder.add( this.vignettePass.params, 'reduction' ).min( 0 ).max( 10 ).step( 0.05 )
    vignettePassFolder.open()
    const zoomBlurPassFolder = postProcessingFolder.addFolder( 'Zoom Blur Pass' )
    zoomBlurPassFolder.add( this.zoomBlurPass.params, 'strength' ).min( 0 ).max( 2 ).step( 0.05 )
    zoomBlurPassFolder.open()

  }

  update( time ) {

    this.mountains.update( time )
    this.floor.update( time )
    this.journey.update()
    this.floorPath.update()

  }

}

export default Indochine