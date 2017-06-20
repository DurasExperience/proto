import './Notoriete.styl'
import Page from './../../base/Page'
import debounce from 'lodash.debounce'
import Store from './../../../../../flux/store/mobile'
import Actions from './../../../../../flux/actions'
import EventsConstants from './../../../../../flux/constants/EventsConstants'
import SVGComponent from './../../ui/SVGComponent/index'

class Notoriete extends Page {

  constructor( props ) {

    super( props )
    this.history = props.history
    this.bind()
    this.FIRST_ROTATE = true

  }

  bind() {

    [ 'onRotate', 'changeChapter' ]
      .forEach( ( fn ) => this[ fn ] = this[ fn ].bind( this ) )
      
    super.bind()
    
  }

  componentDidMount() {

    super.componentDidMount()
    dom.event.on( window, 'orientationchange', this.onRotate )
    TweenMax.to( this.refs.phone, 1, { opacity: 1, onComplete: () => {
      this.animTl.play()
    } } )
    Store.socketRoom.socket.on( 'MOBILE_CHANGE_CHAPTER', this.changeChapter )

  }

  setupAnimations(){

    super.setupAnimations()
    this.tlIn.set( this.refs.parent, { visibility: 'visible' } )
    this.tlIn.fromTo( this.refs.parent, 0.5, { opacity: 0, x: 0 }, { opacity: 1, x: 0 })
    this.tlOut.fromTo( this.refs.parent, 0.5, { opacity: 1, x: 0 }, { opacity: 0, x: 0 })

    TweenMax.set( this.refs.phone, { transformOrigin: '50% 50%' } )

    this.animTl = new TimelineMax({ paused: true, repeat: -1, repeatDelay: 0.5 })
    this.animTl.fromTo( this.refs.phone, 1, { rotation: 0 }, { rotation: 180, ease: Sine.easeOut }, 0 )
    this.animTl.fromTo( this.refs.phone, 1, { rotation: 180 }, { rotation: 0, ease: Sine.easeOut }, 1.5 )

  }

  onRotate( e ) {

    console.log( e, screen.orientation, window.orientation )

    if ( this.FIRST_ROTATE ) {

      this.FIRST_ROTATE = false
      setTimeout( Actions.startChapter() )
      this.animTl.pause()
      this.animTl.repeat( 0 )

    }
    if ( window.orientation === 90 ) TweenMax.to( this.refs.phone, 0.5, { rotation: 0, ease: Sine.easeOut } )
    else if ( window.orientation === -90 ) TweenMax.to( this.refs.phone, 0.5, { rotation: -180, ease: Sine.easeOut } )
    else return
    Store.socketRoom.socket.emit( 'MOBILE_ROTATE' )
    
  }

  render() {

    return(
      <div className="page page--notoriete" ref="parent">
        <div className="phone-icon" ref="phone">
          <SVGComponent width="315" height="157" viewBox="0 0 316 157">
            <g transform="rotate(-90 78.485 78.078)" stroke="#FFF" fill="none" fillRule="evenodd">
              <circle strokeWidth=".5" cx="57.1883602" cy="21.9955231" r="2.19955231"/>
              <ellipse cx="79.1838833" cy="294.74001" rx="10.9977616" ry="10.9977616"/>
              <path d="M11.4977616 35.692837h135.372243v243.150307H11.4977616z"/>
              <rect x=".5" y=".5" width="155.168214" height="313.535981" rx="11"/>
            </g>
          </SVGComponent>
        </div>
      </div>
    )

  }

  changeChapter() {

    Store.socketRoom.socket.off( 'MOBILE_CHANGE_CHAPTER', this.changeChapter )
    dom.event.off( window, 'orientationchange', this.onRotate )
    Actions.changePage( '/duras-song' )

  }

  didTransitionOutComplete() {

    super.didTransitionOutComplete()
    this.history.push( this.nextPath )

  }

  componentWillUnmount() {

    super.componentWillUnmount()

  }

}

export default Notoriete
