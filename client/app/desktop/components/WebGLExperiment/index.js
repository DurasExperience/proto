import loop from 'raf-loop'
import stats from 'stats.js'
import Store from './../../../../flux/store/desktop'
import AudioManager from './../../../../helpers/AudioManager'
import EventsConstants from './../../../../flux/constants/EventsConstants'
import { Clock } from 'three'
import BaseScene from './core/BaseScene'
import Indochine from './chapters/Indochine'

class WebGLExperiment extends React.Component {

  constructor( props ) {

    super()

    this.DELTA_TIME = 0
    this.CURRENT_TIME = 0
    this.currentChapter = undefined

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

    const indochine = new Indochine( this.scene, this.scene.controlsContainer )
    this.chapters = [
      indochine
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

      case '/indochine':
        this.currentChapter = this.chapters[ 0 ]
        this.scene.add( this.currentChapter )

    }

  }

}

export default WebGLExperiment
