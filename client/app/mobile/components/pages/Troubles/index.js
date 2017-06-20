import './troubles.styl'
import Page from './../../base/Page'
import Hammer from 'hammerjs'
import debounce from 'lodash.debounce'
import Store from './../../../../../flux/store/mobile'
import Actions from './../../../../../flux/actions'
import EventsConstants from './../../../../../flux/constants/EventsConstants'
import SVGComponent from './../../ui/SVGComponent/index'

class Troubles extends Page {

  constructor( props ) {

    super( props )
    this.history = props.history
    this.bind()
    this.FIRST_PRESS = true

  }

  bind() {

    [ 'onPressStart', 'onPressEnd', 'changeChapter' ]
      .forEach( ( fn ) => this[ fn ] = this[ fn ].bind( this ) )
      
    super.bind()
    
  }

  componentDidMount() {

    super.componentDidMount()
    this.hammer = new Hammer( this.refs.parent )
    this.hammer.on( 'press', this.onPressStart )
    TweenMax.to( this.refs.pointer, 1, { opacity: 1, onComplete: () => {
      this.animTl.play()
    } } )
    Store.socketRoom.socket.on( 'MOBILE_CHANGE_CHAPTER', this.changeChapter )

  }

  setupAnimations(){

    super.setupAnimations()
    this.tlIn.set( this.refs.parent, { visibility: 'visible' } )
    this.tlIn.fromTo( this.refs.parent, 0.5, { opacity: 0, x: 0 }, { opacity: 1, x: 0 })
    this.tlOut.fromTo( this.refs.parent, 0.5, { opacity: 1, x: 0 }, { opacity: 0, x: 0 })

    TweenMax.set( this.refs.inner, { transformOrigin: '50% 50%' } )

    const length = this.refs.stroke.getTotalLength()
    console.log( this.refs.stroke, length )
    const offset = {
      val: length
    }
    this.refs.stroke.style.strokeDasharray = offset.val
    this.refs.stroke.style.strokeDashoffset = offset.val
    this.animTl = new TimelineMax({ paused: true, repeat: -1 })
    this.animTl.timeScale( 1.5 )
    this.animTl.fromTo( this.refs.inner, 1, { scale: 1 }, { scale: 0.5, ease: Sine.easeOut }, 0.5 )
    this.animTl.fromTo( offset, 1, { val: length }, { val: 0, onUpdate: () => {
      this.refs.stroke.style.strokeDashoffset = offset.val
    } }, 1.5 )
    this.animTl.fromTo( this.refs.inner, 1, { scale: 0.5 }, { scale: 1, ease: Sine.easeOut }, 2.5 )
    this.animTl.add( () => { this.refs.stroke.style.strokeDashoffset = length } , 3.5)

  }

  onPressStart( event ){

    if ( this.FIRST_PRESS ) {

      this.FIRST_PRESS = false
      setTimeout( Actions.startChapter() )
      this.animTl.pause()
      this.animTl.repeat( 0 )
      this.animTl.progress( 1 )

    }
    this.animTl.restart()
    console.log( 'press start' )
    Store.socketRoom.socket.emit( 'MOBILE_PRESS_START' )
    this.pressTimeout = setTimeout( this.onPressEnd, 1500 )

  }

  onPressEnd(  ){

    console.log( 'press end' )
    Store.socketRoom.socket.emit( 'MOBILE_PRESS_END' )

  }

  render() {

    return(
      <div className="page page--troubles" ref="parent">
        <div className="press-pointer" ref="pointer">
            <SVGComponent viewBox="0 0 100 100">
                <path ref="bg" className="press-pointer__bg" fill="#ffffff" d="M49,2.5H51c25.7,0,46.5,20.8,46.5,46.5V51c0,25.7-20.8,46.5-46.5,46.5H49C23.3,97.5,2.5,76.7,2.5,51V49
		C2.5,23.3,23.3,2.5,49,2.5L49,2.5z"/>
                <path ref="inner" className="press-pointer__inner" fill="#ffffff" d="M49,2.5H51c25.7,0,46.5,20.8,46.5,46.5V51c0,25.7-20.8,46.5-46.5,46.5H49C23.3,97.5,2.5,76.7,2.5,51V49
		C2.5,23.3,23.3,2.5,49,2.5L49,2.5z"/>
                <path ref="stroke" fill="transparent" stroke="#ffffff" strokeWidth="4" d="M49,2.5H51c25.7,0,46.5,20.8,46.5,46.5V51c0,25.7-20.8,46.5-46.5,46.5H49C23.3,97.5,2.5,76.7,2.5,51V49
		C2.5,23.3,23.3,2.5,49,2.5L49,2.5z"/>
            </SVGComponent>
        </div>
      </div>
    )

  }

  changeChapter() {

    this.hammer.off( 'press', this.onPressStart )
    clearTimeout( this.pressTimeout )
    Store.socketRoom.socket.off( 'MOBILE_CHANGE_CHAPTER', this.changeChapter )
    Actions.changePage( '/notoriete' )

  }

  didTransitionOutComplete() {

    super.didTransitionOutComplete()
    this.history.push( this.nextPath )

  }

  componentWillUnmount() {

    super.componentWillUnmount()

  }

}

export default Troubles
