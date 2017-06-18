import './indochine.styl'
import Page from './../../base/Page'
import Hammer from 'hammerjs'
import debounce from 'lodash.debounce'
import Store from './../../../../../flux/store/mobile'
import Actions from './../../../../../flux/actions'
import EventsConstants from './../../../../../flux/constants/EventsConstants'

class Indochine extends Page {

  constructor( props ) {

    super( props )
    this.history = props.history
    this.bind()
    this.FIRST_PINCH = true
    this.PINCH_STARTED = false

  }

  bind() {

    [ 'onWindowResize', 'onPinchStart', 'onPinchMove', 'onPinchEnd' ]
      .forEach( ( fn ) => this[ fn ] = this[ fn ].bind( this ) )
      
    super.bind()
    
  }

  componentDidMount() {

    super.componentDidMount()
    this.hammer = new Hammer( this.refs.parent )
    this.hammer.get( 'pinch' ).set({ enable: true  })
    this.hammer.get( 'rotate' ).set({ enable: true })
    this.hammer.on( 'pinchstart', this.onPinchStart )
    this.hammer.on( 'pinchmove', this.onPinchMove )
    this.hammer.on( 'pinchend', this.onPinchEnd )

    const scale = Math.min( Store.Size.w / 800, Store.Size.h / 800 )
    dom.style( this.refs.interaction, {
      transform: `scale3d(${ scale }, ${ scale }, ${ scale })`
    } )
    this.spriteTween = TweenMax.to( this.refs.interaction, 1.25, { backgroundPosition: '-62400px 0', ease: SteppedEase.config(78), repeat: -1, paused: true } )
    TweenMax.to( this.refs.interaction, 0.5, { opacity: 1, delay: 1,onComplete: () => {
      this.spriteTween.play()
    } } )

    Store.on( EventsConstants.WINDOW_RESIZE, this.onWindowResize )

  }

  setupAnimations(){

    super.setupAnimations()
    this.tlIn.set( this.refs.parent, { visibility: 'visible' } )
    this.tlIn.fromTo( this.refs.parent, 0.5, { opacity: 0, x: 0 }, { opacity: 1, x: 0 })
    this.tlOut.fromTo( this.refs.parent, 0.5, { opacity: 1, x: 0 }, { opacity: 0, x: 0 })

  }

  onPinchStart( event ){

    if ( this.PINCH_STARTED ) return
    if ( this.FIRST_PINCH ) {

      // TweenMax.set( this.refs.interaction, { opacity: 0 } )
      dom.style( this.refs.interaction, {
        display: 'none',
        opacity: 0
      } )
      this.spriteTween.kill()
      this.FIRST_PINCH = false
      setTimeout( Actions.startChapter() )

    }
    this.PINCH_STARTED = true
    TweenMax.to( this.refs.pointer1, 1, { scale: 1, ease: Expo.easeOut } )
    TweenMax.to( this.refs.pointer2, 1, { scale: 1, ease: Expo.easeOut } )
    console.log( 'pinch start' )
    Store.socketRoom.socket.emit( 'MOBILE_PINCH_START' )

  }

  onPinchEnd( event ){

    if ( !this.PINCH_STARTED ) return
    TweenMax.to( this.refs.pointer1, 1, { scale: 0, ease: Expo.easeOut } )
    TweenMax.to( this.refs.pointer2, 1, { scale: 0, ease: Expo.easeOut } )
    this.PINCH_STARTED = false
    console.log( 'pinch end' )
    Store.socketRoom.socket.emit( 'MOBILE_PINCH_END' )

  }

  onPinchMove( event ) {

    if ( !this.PINCH_STARTED ) return
    dom.style( this.refs.pointer1, {
      top: event.pointers[ 0 ].clientY + 'px',
      left: event.pointers[ 0 ].clientX + 'px'
    } )

    dom.style( this.refs.pointer2, {
      top: event.pointers[ 1 ].clientY + 'px',
      left: event.pointers[ 1 ].clientX + 'px'
    } )

  }

  render() {

    return(
      <div className="page page--indochine" ref="parent">
        <div className="interaction" ref="interaction"></div>
        <div className="pinch-pointer" ref="pointer1"></div>
        <div className="pinch-pointer" ref="pointer2"></div>
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

  componentWillUnmount() {

    this.hammer.off( 'pinchstart', this.onPinchStart)
    this.hammer.off( 'pinchmove', this.onPinchMove )
    this.hammer.off( 'pinchend', this.onPinchEnd )
    Store.off( EventsConstants.WINDOW_RESIZE, this.onWindowResize )
    super.componentWillUnmount()

  }

}

export default Indochine
