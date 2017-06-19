import Store from './../../../../../flux/store/desktop'
import EventsConstants from './../../../../../flux/constants/EventsConstants'
import OrbitControls from './../../../../../utils/webgl/OrbitControls'
import PointerLockControls from './../../../../../utils/webgl/PointerLockControls'
import { Scene, WebGLRenderer, PerspectiveCamera, AxisHelper, Vector3, Object3D, AmbientLight, PointLight } from 'three'
import Wagner from 'avdp-wagner'
import FXAAPass from 'avdp-wagner/src/passes/fxaa/FXAAPass'
import GUI from './../../../../../helpers/GUI'
import Config from './Config/'
import GlobalConfig from './../../../../../config'

class BaseScene extends Scene {

  constructor( width, height ) {

    super()

    this.config = Config.baseScene

    this.renderer = new WebGLRenderer({ antialias: true })
    this.renderer.setSize( width, height )
    this.renderer.setPixelRatio( window.devicePixelRatio )
    // this.renderer.precision = 'lowp'

    this.renderer.setClearColor( 0x07080E, 1 )
    this.renderer.autoClear = false
    this.renderer.gammaInput = true
    this.renderer.gammaOutput = true

    this.camera = new PerspectiveCamera( 50, width / height, 0.1, 15000 )

    this.setControls()
    // this.axisHelper = new AxisHelper( 200 )
    // this.add( this.axisHelper )

    this.passes = []

    this.initLights()
    this.initPostProcessing()
    this.addGUI()
    this.onGyroMove = this.onGyroMove.bind( this )
    this.initialRotation = {
      y: this.camera.rotation.y
    }
    if ( GlobalConfig.mobileConnect ) {
      Store.on( EventsConstants.APP_START, () => {
        Store.socketRoom.on( 'GYRO_MOVE', this.onGyroMove )
      } )
    }

  }

  onGyroMove( val ) {

    const rX = val.x / 100
    // console.log( rX )
    TweenMax.to( this.camera.rotation, 0.3, {
      y: this.initialRotation.y + rX * 1.5,
      ease: Sine.easeOut
    } )
    
  }

  setControls() {

    if ( GlobalConfig.debug ) {

      this.camera.position.set( 0, 0, 0 )
      // this.camera.lookAt( new Vector3( 0, 0, 0 ) )
      this.controls = new OrbitControls( this.camera, this.renderer.domElement )
      this.controls.enabled = true

    } else {

      this.center = new Vector3( 0, 0, 0 )
      const controlsPosition = {
        x: 0,
        y: 0,
        z: 0
      }
      this.camera.position.set( 0, 0, 0 )
      this.camera.lookAt( new Vector3( 0, 0, 0 ) )
      this.controls = new PointerLockControls( this.camera, controlsPosition, this.center, 0.1 )
      this.controls.enabled = false
      this.controlsContainer = new Object3D()
      this.controlsContainer.add( this.controls.getObject() )
      this.add( this.controlsContainer )

    }

  }

  addGUI() {

    this.camera.position.range = [ -1000, 1000 ]
    this.camera.rotation.range = [ -3, 3 ]

    GUI.panel
      .addGroup({ label: 'Scene Camera', enable: true })
        .addSubGroup({ label: 'Position' })
          .addSlider( this.camera.position, 'x', 'range', { step: 10 } )
          .addSlider( this.camera.position, 'y', 'range', { step: 10 } )
          .addSlider( this.camera.position, 'z', 'range', { step: 10 } )
        .addSubGroup({ label: 'Rotation' })
          .addSlider( this.camera.rotation, 'x', 'range', { step: 0.01 } )
          .addSlider( this.camera.rotation, 'y', 'range', { step: 0.01 } )
          .addSlider( this.camera.rotation, 'z', 'range', { step: 0.01 } )

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

  }

  setupPostProcessing( passes ) {

    this.passes = []
    this.passes = passes

  }

  resize(newWidth, newHeight) {

    this.camera.aspect = newWidth / newHeight
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(newWidth, newHeight)
    this.composer.setSize(newWidth, newHeight)

  }

  render() {

    this.composer.reset()
    this.composer.render( this, this.camera )
    for ( const pass of this.passes ) {

      this.composer.pass( pass )

    }
    this.composer.pass( this.fxaaPass )
    this.composer.toScreen()

  }

}

export default BaseScene
