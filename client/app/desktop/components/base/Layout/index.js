import './Layout.styl'
import Page from './../../base/Page'
import Chapter from './../../ui/Chapter'
import Tuto from './../../ui/Tuto'
import Store from './../../../../../flux/store/desktop/index'
import Actions from './../../../../../flux/actions'
import EventsConstants from './../../../../../flux/constants/EventsConstants.js'
import Config from './../../../../../config'
import _ from 'underscore'

class Layout extends Page {

  constructor( props ) {

    super( props )
    this.history = props.history
    this.first = true
    this.tuto = false
    this.onPinch = this.onPinch.bind( this )
    this.showLayout = this.showLayout.bind( this )
    this.tutoDisplayer = this.tutoDisplayer.bind( this )

    this.state = {
      render: true
    }
    // this.mouseEvent()

    Store.on( EventsConstants.TUTO_DISPLAY, this.tutoDisplayer )

  }

  mouseEvent(){

    let throttled = _.throttle(this.showLayout, 5200, { 'trailing': false, 'leading': true });
    window.addEventListener("mousemove", throttled);

  }

  componentDidMount() {

    super.componentDidMount()
    if ( Config.mobileConnect ) Store.socketRoom.on( 'pinch', this.onPinch )
    else dom.event.on( this.refs.parent, 'click', this.onPinch )

  }

  setupAnimations(){

    super.setupAnimations()
    this.tlIn.set( this.refs.parent, { visibility: 'visible' } )
    this.tlIn.fromTo( this.refs.parent, 0.5, { opacity: 0 }, { opacity: 1 })
    this.tlOut.fromTo( this.refs.parent, 0.5, { opacity: 1 }, { opacity: 0 })

  }

  render() {

    if ( this.state.render ) {
      return(
        <div className="page" ref="parent">
        {(this.first == true  ? <div className="page__gradient"></div> : null)}
          <div className="page--layout">
            {(this.first == true  ? <Chapter chapterText={this.props}/> : null)}
            {(this.tuto == true  ? <Tuto tutoText={this.props} />: null)}
          </div>
        </div>
      )
    } else return null

  }

  didTransitionOutComplete() {

    super.didTransitionOutComplete()
    this.history.push( this.nextPath )

  }

  onPinch() {

    if ( !this.first ) return
    this.first = false
    TweenMax.to( this.refs.parent, 0.5, { opacity: 0, onComplete: () => {

      setTimeout( Actions.startChapter )
      this.setState({ render: false })

    } } )

  }


  tutoDisplayer( display ){

    this.tuto = display
    this.setState({ render: display })
    TweenMax.to( this.refs.parent, 0.2, { opacity: 1, visibility: "visible", onComplete: () => {

      setTimeout( () => {

        this.tuto = false
        this.setState( { render: false } )

      }, 6400)

    } })

  }

  showLayout(){

    if ( !this.first ) {

      this.setState({ render: true })

      TweenMax.to( this.refs.parent, 0.2, { opacity: 1, visibility: "visible", onComplete: () => {

        setTimeout( () => {

          this.setState( { render: false } )

        }, 5000)

      } })
    }

  }

}

export default Layout
