import Store from './../../../../../flux/store'
import EventsConstants from './../../../../../flux/constants/EventsConstants'
import OrbitControls from './../../../../../utils/webgl/OrbitControls'
import PointerLockControls from './../../../../../utils/webgl/PointerLockControls'
import { Scene, WebGLRenderer, PerspectiveCamera, AxisHelper, Vector3, Object3D, AmbientLight, PointLight } from 'three'
import Wagner from '@superguigui/wagner'
import FXAAPass from '@superguigui/wagner/src/passes/fxaa/FXAAPass'
import BoxBlurPass from '@superguigui/wagner/src/passes/box-blur/BoxBlurPass'
import VignettePass from '@superguigui/wagner/src/passes/vignette/VignettePass'
import ZoomBlurPass from '@superguigui/wagner/src/passes/zoom-blur/ZoomBlurPass';
import GUI from './../../../../../helpers/GUI'
import Config from './Config'

class BaseScene extends Scene {

  constructor( width, height ) {

    super()

    this.config = Config

    this.renderer = new WebGLRenderer({ antialias: true })
    this.renderer.setSize( width, height )
    this.renderer.setPixelRatio( window.devicePixelRatio )

    this.renderer.setClearColor( 0x222222, 1 )
    this.renderer.autoClear = false
    this.renderer.gammaInput = true
    this.renderer.gammaOutput = true

    this.camera = new PerspectiveCamera( 50, width / height, 1, 15000 )
    this.camera.position.set( 0, 0, 0 )
    this.camera.lookAt( new Vector3( 0, 0, 0 ) )

    this.setControls()

    this.axisHelper = new AxisHelper( 200 )
    this.add( this.axisHelper )

    this.initLights()
    this.initPostProcessing()
    this.addGUI()

  }

  setControls() {



    if ( this.config.manual ) {

      this.controls = new OrbitControls( this.camera, this.renderer.domElement )
      this.controls.enabled = true

    } else {

      this.center = new Vector3( 0, 0, 0 )
      const controlsPosition = {
        x: 0,
        y: 0,
        z: 0
      }
      this.controls = new PointerLockControls( this.camera, controlsPosition, this.center, 0.1 )
      this.controls.enabled = false
      this.controlsContainer = new Object3D()
      this.controlsContainer.add( this.controls.getObject() )
      this.add( this.controlsContainer )

    }

  }

  addGUI() {

    const postProcessingFolder = GUI.addFolder('Post Processing')
    // postProcessingFolder.open()
    const vignettePassFolder = postProcessingFolder.addFolder('Vignette Pass')
    vignettePassFolder.add(this.vignettePass.params, 'boost').min(0).max(10).step(0.05)
    vignettePassFolder.add(this.vignettePass.params, 'reduction').min(0).max(10).step(0.05)
    vignettePassFolder.open()
    const zoomBlurPassFolder = postProcessingFolder.addFolder('Zoom Blur Pass')
    zoomBlurPassFolder.add(this.zoomBlurPass.params, 'strength').min(0).max(2).step(0.05)
    zoomBlurPassFolder.open()

  }

  initLights() {

    this.ambientLight = new AmbientLight(0xFFFFFF, 1)
    this.add(this.ambientLight)

    this.pointLight = new PointLight(0xFFFFFF, 1)
    this.pointLight.position.set(150, 150, 150)
    this.add(this.pointLight)

  }

  initPostProcessing() {

    this.composer = new Wagner.Composer( this.renderer )
    this.fxaaPass = new FXAAPass()
    this.boxBlurPass = new BoxBlurPass( 0.3, 0.3 )
    this.vignettePass = new VignettePass( this.config.vignettePass )
    this.zoomBlurPass = new ZoomBlurPass( this.config.zoomBlurPass )

  }

  resize(newWidth, newHeight) {

    this.camera.aspect = newWidth / newHeight
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(newWidth, newHeight)
    this.composer.setSize(newWidth, newHeight)

  }

  render() {

    this.composer.reset()
    this.composer.render(this, this.camera)
    this.composer.pass(this.fxaaPass)
    this.composer.pass(this.boxBlurPass)
    this.composer.pass(this.vignettePass)
    this.composer.pass(this.zoomBlurPass)
    this.composer.toScreen()

  }

}

export default BaseScene