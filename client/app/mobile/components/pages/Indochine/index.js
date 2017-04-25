import './indochine.styl'
import Page from './../../base/Page'
import Hammer from 'hammerjs'
import _ from 'underscore'
import throttle from 'lodash.throttle'

class Indochine extends Page {

  constructor( props ) {

    super( props )
    this.history = props.history

  }

  componentDidMount() {

    super.componentDidMount()
    let container = this.refs.parent
    let mc = new Hammer.Manager( container )
    let Pinch = new Hammer.Pinch()
    mc.add(Pinch);
    mc.on( 'pinch', this.pinched( event ) )

  }

  setupAnimations(){

    super.setupAnimations()
    this.tlIn.set( this.refs.parent, { visibility: 'visible' } )
    this.tlIn.fromTo( this.refs.parent, 0.5, { opacity: 0, x: 0 }, { opacity: 1, x: 0 })
    this.tlOut.fromTo( this.refs.parent, 0.5, { opacity: 1, x: 0 }, { opacity: 0, x: 0 })

  }

  pinched( event ){

    let throttled = _.throttle(event, 100)
    console.log("pinch", throttled)

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
