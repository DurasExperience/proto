import './indochine.styl'
import Page from './../../base/Page'
import Hammer from 'hammerjs'
import debounce from 'lodash.debounce'
import Store from './../../../../../flux/store/mobile'
import EventsConstants from './../../../../../flux/constants/EventsConstants'

class Indochine extends Page {

  constructor( props ) {

    super( props )
    this.history = props.history
    this.onWindowResize = this.onWindowResize.bind( this )

  }

  componentDidMount() {

    super.componentDidMount()
    const hammer = new Hammer( this.refs.parent )
    hammer.get( 'pinch' ).set({ enable: true  })
    hammer.get( 'rotate' ).set({ enable: true })
    hammer.on( 'pinchend', debounce( () => this.pinched(), 1000 ) )
    const scale = Math.min( Store.Size.w / 800, Store.Size.h / 800 )
    dom.style( this.refs.interaction, {
      transform: `scale3d(${ scale }, ${ scale }, ${ scale })`
    } )
    TweenMax.to( this.refs.interaction, 1.25, { backgroundPosition: '-62400px 0', ease: SteppedEase.config(78), repeat: -1 } )

    Store.on( EventsConstants.WINDOW_RESIZE, this.onWindowResize )

  }

  setupAnimations(){

    super.setupAnimations()
    this.tlIn.set( this.refs.parent, { visibility: 'visible' } )
    this.tlIn.fromTo( this.refs.parent, 0.5, { opacity: 0, x: 0 }, { opacity: 1, x: 0 })
    this.tlOut.fromTo( this.refs.parent, 0.5, { opacity: 1, x: 0 }, { opacity: 0, x: 0 })

  }

  pinched( event ){

    // console.log( 'pinch', event)
    console.log( Store.socketRoom.socket )
    Store.socketRoom.socket.emit( 'mobilePinch', 'test' )

  }

  render() {

    return(
      <div className="page page--indochine" ref="parent">
        <div className="interaction" ref="interaction"></div>
      </div>
    )

  }

  onWindowResize() {

    const scale = Math.min( Store.Size.w / 800, Store.Size.h / 800 )
    dom.style( this.refs.interaction, {
      transform: `scale(${ scale })`
    } )

  }

  didTransitionOutComplete() {

    super.didTransitionOutComplete()
    this.history.push( this.nextPath )

  }

}

export default Indochine
