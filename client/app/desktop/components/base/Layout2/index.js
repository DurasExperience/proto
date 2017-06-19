import './Layout.styl'
import Page from './../../base/Page'
import Chapter from './../../ui/Chapter'
import Tuto from './../../ui/Tuto'
import Menu from './../../ui/Menu'
import SoundLevel from './../../ui/SoundLevel'
import Store from './../../../../../flux/store/desktop/index'
import Actions from './../../../../../flux/actions'
import EventsConstants from './../../../../../flux/constants/EventsConstants.js'
import Config from './../../../../../config'
import AudioManager from './../../../../../helpers/AudioManager'
import _ from 'underscore'

class Layout2 extends Page {

  constructor( props ) {

    super( props )
    this.history = props.history
    this.first = true
    this.tuto = false
    this.onPinch = this.onPinch.bind( this )
    this.tutoDisplayer = this.tutoDisplayer.bind( this )

    this.state = {
      render: true
    }

    console.log( 'layout2' )
    Store.on( EventsConstants.TUTO_DISPLAY, this.tutoDisplayer )

  }

  setupSound() {

    this.transitionSound = AudioManager.get( '00_transition' )
    if ( !this.transitionSound ) return
    this.transitionSoundId = this.transitionSound.play()
    this.transitionSound.fade( 0, 0.25, 500, this.transitionSoundId )

  }

  componentDidMount() {

    super.componentDidMount()
    // if ( Config.mobileConnect ) {
    //   Store.socketRoom.on( EventsConstants.PINCH_END, this.onPinch )
    //   Store.socketRoom.on( EventsConstants.PRESS_END, this.onPinch )
    // }
    // else dom.event.on( this.refs.parent, 'click', this.onPinch )
    this.setupSound()
    console.log( 'mounted' )

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
            {(this.tuto == true  ? <Tuto tutoText={this.props.tutoText} tutoAnim={this.props.tutoAnim} />: null)}
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

    console.log( 'pinch' )
    if ( !this.first ) return
    this.first = false
    TweenMax.to( this.refs.parent, 0.5, { opacity: 0, onComplete: () => {

      if ( this.transitionSound ) this.transitionSound.fade( 0.25, 0, 500, this.transitionSoundId )
      if ( Config.mobileConnect ) {
        Store.socketRoom.off( EventsConstants.PINCH_END, this.onPinch )
        Store.socketRoom.off( EventsConstants.PRESS_END, this.onPinch )
      }
      else dom.event.off( this.refs.parent, 'click', this.onPinch )
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


}

export default Layout2
