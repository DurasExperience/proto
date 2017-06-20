import './DurasSong.styl'
import Page from './../../base/Page'
import Hammer from 'hammerjs'
import debounce from 'lodash.debounce'
import Store from './../../../../../flux/store/mobile'
import Actions from './../../../../../flux/actions'
import EventsConstants from './../../../../../flux/constants/EventsConstants'
import SVGComponent from './../../ui/SVGComponent/index'

class DurasSong extends Page {

  constructor( props ) {

    super( props )
    this.history = props.history
    this.FIRST_PRESS = true

  }

  componentDidMount() {

    super.componentDidMount()

  }

  setupAnimations(){

    super.setupAnimations()
    this.tlIn.set( this.refs.parent, { visibility: 'visible' } )
    this.tlIn.fromTo( this.refs.parent, 0.5, { opacity: 0, x: 0 }, { opacity: 1, x: 0 })
    this.tlOut.fromTo( this.refs.parent, 0.5, { opacity: 1, x: 0 }, { opacity: 0, x: 0 })

  }

  render() {

    return(
      <div className="page page--troubles" ref="parent">
      </div>
    )

  }

  didTransitionOutComplete() {

    super.didTransitionOutComplete()
    this.history.push( this.nextPath )

  }

  componentWillUnmount() {

    super.componentWillUnmount()

  }

}

export default DurasSong
