import './indochine.styl'
import Page from './../../base/Page'
import Hammer from 'hammerjs'
import debounce from 'lodash.debounce'
import Store from './../../../../../flux/store/mobile'

class Indochine extends Page {

  constructor( props ) {

    super( props )
    this.history = props.history

  }

  componentDidMount() {

    super.componentDidMount()
    const hammer = new Hammer( this.refs.parent )
    hammer.get( 'pinch' ).set({ enable: true  })
    hammer.get( 'rotate' ).set({ enable: true })
    hammer.on( 'pinchend', debounce( () => this.pinched(), 1000 ) )

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
      <div className="page" ref="parent">
      </div>
    )

  }

  didTransitionOutComplete() {

    super.didTransitionOutComplete()
    this.history.push( this.nextPath )

  }

}

export default Indochine
