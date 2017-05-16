import loop from 'raf-loop'
import stats from 'stats.js'
import Store from './../../../../flux/store/desktop'
import AudioManager from './../../../../helpers/AudioManager'
import EventsConstants from './../../../../flux/constants/EventsConstants'
import { Clock, Mesh, MeshBasicMaterial, BoxBufferGeometry } from 'three'
import BaseScene from './core/BaseScene'
import Indochine01 from './chapters/Indochine/01'
import Indochine02 from './chapters/Indochine/02'
import Config from './../../../../config'

class WebGLExperiment extends React.Component {

  constructor( props ) {

    super()

    this.DELTA_TIME = 0
    this.CURRENT_TIME = 0
    this.currentChapter = undefined
    this.config = Config

  }

  render() {

    return(
      <div className="canvas-container" ref="parent"></div>
    )

  }

  componentDidMount() {

    this.scene = new BaseScene( Store.Size.w, Store.Size.h )
    this.refs.parent.appendChild( this.scene.renderer.domElement )

    Store.on( EventsConstants.APP_START, () => {

      this.start()

    } )

  }

  start() {

    this.clock = new Clock()

    this.stats = new stats()
    dom.classes.add( this.stats.dom, 'stats-js' )
    this.refs.parent.appendChild( this.stats.dom )

    this.bind()
    this.addListeners()

    this.loop = loop( this.update )
    this.loop.start()

    if ( this.config.debug ) {
      const geo = new BoxBufferGeometry( 100, 100, 100 )
      const mat = new MeshBasicMaterial({
        color: 0xff0000
      })
      const m = new Mesh( geo, mat )
      this.scene.add( m )
      this.controlsContainer = m
    } else {
      this.controlsContainer = this.scene.controlsContainer
    }

    const indochine01 = new Indochine01( this.scene, this.controlsContainer )
    const indochine02 = new Indochine02( this.scene, this.controlsContainer )
    this.chapters = [
      indochine01,
      indochine02
    ]
    if ( Store.Routes.newRoute !== '/' ) this.routeChanged( Store.Routes )

  }

  bind() {

    [ 'resize', 'routeChanged', 'update' ]
        .forEach( ( fn ) => this[ fn ] = this[ fn ].bind( this ) )

  }

  addListeners() {

    Store.on( EventsConstants.WINDOW_RESIZE, this.resize )
    Store.on( EventsConstants.ROUTE_CHANGED, this.routeChanged )

  }

  resize() {

    this.scene.resize( Store.Size.w, Store.Size.h )
    // this.currentChapter.resize( Store.Size.w, Store.Size.h )

  }

  update() {

    this.stats.begin()

    this.DELTA_TIME = this.clock.getDelta()
    this.CURRENT_TIME = this.clock.getElapsedTime()

    if(this.currentChapter !== undefined) this.currentChapter.update( this.CURRENT_TIME )

    this.scene.render()

    this.stats.end()


  }

  routeChanged( routes ) {

    if ( this.currentChapter !== undefined ) this.scene.remove( this.currentChapter )
    switch ( routes.newRoute ) {

      case '/indochine/01':
        this.currentChapter = this.chapters[ 0 ]
        this.currentChapter.start()
        this.scene.add( this.currentChapter )
        break

      case '/indochine/02':
        this.currentChapter = this.chapters[ 1 ]
        this.currentChapter.start()
        this.scene.add( this.currentChapter )
        break
        
    }

  }

}

export default WebGLExperiment
