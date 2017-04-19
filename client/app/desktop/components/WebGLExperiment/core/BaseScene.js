import Store from './../../../../../flux/store'
import EventsConstants from './../../../../../flux/constants/EventsConstants'
import { Scene, WebGLRenderer, PerspectiveCamera, Vector3, AmbientLight, PointLight } from 'three'
import OrbitControls from './../../../../../utils/webgl/OrbitControls'
import Wagner from '@superguigui/wagner'
import FXAAPass from '@superguigui/wagner/src/passes/fxaa/FXAAPass'

class BaseScene extends Scene {

  constructor( width, height ) {

    super()

    this.renderer = new WebGLRenderer({ antialias: true })
    this.renderer.setSize( width, height )
    this.renderer.setPixelRatio( window.devicePixelRatio )

    this.renderer.setClearColor ( 0x222222, 1 )
    this.renderer.autoClear = false
    this.renderer.gammaInput = true
    this.renderer.gammaOutput = true

    this.camera = new PerspectiveCamera( 50, width / height, 1, 10000 )
    this.camera.position.set( 0, 80, 500 )
    this.camera.lookAt( new Vector3( 0, 0, 0 ) )

    this.controls = new OrbitControls( this.camera, this.renderer.domElement )
    this.controls.enabled = true

    this.axisHelper = new THREE.AxisHelper( 200 )
    this.add( this.axisHelper )

    this.initLights()
    this.initPostProcessing()

  }

  initLights() {

    this.ambientLight = new AmbientLight( 0xFFFFFF, 1 )
    this.add( this.ambientLight )

    this.pointLight = new PointLight( 0xFFFFFF, 1 )
    this.pointLight.position.set( 150, 150, 150 )
    this.add( this.pointLight )

  }

  initPostProcessing() {

    this.composer = new Wagner.Composer( this.renderer )
    this.fxaaPass = new FXAAPass()

  }

  resize( newWidth, newHeight ) {

    this.camera.aspect = newWidth / newHeight
    this.camera.updateProjectionMatrix()

    this.renderer.setSize( newWidth, newHeight )
    this.composer.setSize( newWidth, newHeight )

  }

  render() {

    this.composer.reset()
    this.composer.render( this, this.camera )
    this.composer.pass( this.fxaaPass )
    this.composer.toScreen()

  }

}

export default BaseScene