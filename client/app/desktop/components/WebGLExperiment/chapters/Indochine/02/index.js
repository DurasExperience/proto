import { Group, Mesh, SphereBufferGeometry, MeshBasicMaterial } from 'three'
import HandWoman from './HandWoman'
import HandMan from './HandMan'
import BackgroundHands from './BackgroundHands'
import Background from './Background'
import Observer from './Observer'

import Actions from './../../../../../../../flux/actions'
import Store from './../../../../../../../flux/store/desktop'
import EventsConstants from './../../../../../../../flux/constants/EventsConstants'
import AudioManager from './../../../../../../../helpers/AudioManager'
import GUI from './../../../../../../../helpers/GUI'
import Config from './Config/'
import GlobalConfig from '././../../../../../../../config'

import BoxBlurPass from 'avdp-wagner/src/passes/box-blur/BoxBlurPass'
import VignettePass from 'avdp-wagner/src/passes/vignette/VignettePass'
import ZoomBlurPass from 'avdp-wagner/src/passes/zoom-blur/ZoomBlurPass'
import MultiPassBloomPass from 'avdp-wagner/src/passes/bloom/MultiPassBloomPass'
import BlendPass from 'avdp-wagner/src/passes/blend/BlendPass'
import GodrayPass from 'avdp-wagner/src/passes/godray/godraypass'

class Indochine02 extends Group {

  constructor( scene, controlsContainer ) {

    super()
    this.name = 'indochine-02'
    this.scene = scene
    this.config = Config.indochine_02
    this.bind()

    this.observer = new Observer( scene, controlsContainer, this.fadeOut )
    this.observer.enableSpline()

    this.background = new Background()
    this.handWoman = new HandWoman( this.observer.duration )
    this.handMan = new HandMan( this.observer.duration )

    this.add( this.background  )
    this.add( this.handWoman )
    this.add( this.handMan )
    this.objects = [ this.handWoman, this.handMan, this.background ]

    this.initPostProcessing()
    this.setupSound()
    this.count = 0

  }

  bind() {

    [ 'resize', 'update', 'reverse', 'fadeIn', 'fadeOut', 'play', 'clearGroup' ]
      .forEach( ( fn ) => this[ fn ] = this[ fn ].bind( this ) )

  }

  addListeners() {

    if ( GlobalConfig.mobileConnect ) Store.socketRoom.on( 'pinch', this.reverse )
    else Store.on( EventsConstants.SPACE_DOWN, this.reverse )

  }

  removeListeners() {

    // Store.off( EventsConstants.END_AMBIENT, this.clearAmbientSound )

  }


  start() {

    this.scene.setupPostProcessing( this.passes )
    this.play()
    this.addGUI()

  }

  play() {

    this.objects.push( this.observer )
    this.fadeIn()
    this.observer.init()
    /**
    * show spline
    */
    this.observer.createGeometry()
    this.observer.start()
    this.observer.play()

    this.handWoman.init()
    this.handMan.init()
    this.addListeners()

  }

  down(){

  }

  setupSound(){

    this.surfaceAmbientSound = AudioManager.get( '01_01_ambient_surface' )

    this.surfaceSound = AudioManager.get( '01_02_voice' )
    this.duration = Math.ceil( this.surfaceSound.duration() )

  }

  initPostProcessing() {

    this.boxBlurPass = new BoxBlurPass( this.config.postProcessing.boxBlurPass.x, this.config.postProcessing.boxBlurPass.y )
    this.vignettePass = new VignettePass( {
      boost: 1,
      reduction: 0
    } )
    this.zoomBlurPass = new ZoomBlurPass( this.config.postProcessing.zoomBlurPass )
    this.multiPassBloomPass = new MultiPassBloomPass( this.config.postProcessing.multiPassBloomPass )
    this.passes = [ this.boxBlurPass, this.multiPassBloomPass, this.zoomBlurPass ]

  }

  addGUI() {

    this.observer.addGUI()
    this.handWoman.addGUI()
    this.handMan.addGUI()
    this.background.addGUI()

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

  reverse() {

    this.background.reverse()
    this.handWoman.reverse( 4 )
    this.handMan.reverse( 4 )

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

    this.remove( this.observer )
    this.remove( this.handWoman )
    this.remove( this.handMan )
    this.passes = []
    this.scene.setupPostProcessing( this.passes )


  }


  update( time ) {

    for ( let obj of this.objects ) {

      obj.update( time )

    }

    const newTime = this.duration - this.surfaceSound.seek()

    if( newTime === this.duration ){

      Actions.endAmbient( )

      setTimeout( () => {

        Actions.changeSubpage( '/troubles/01' )

      }, 2500)

    }

  }

  resize( newWidth, newHeight ) {

  }

}

export default Indochine02
