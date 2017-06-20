import './Layout.styl'
import Page from './../../base/Page'
import Chapter from './../../ui/Chapter'
import Tuto from './../../ui/Tuto'
import VideoWrapper from './VideoWrapper'
import Store from './../../../../../flux/store/desktop/index'
import Actions from './../../../../../flux/actions'
import EventsConstants from './../../../../../flux/constants/EventsConstants.js'
import Config from './../../../../../config'
import AudioManager from './../../../../../helpers/AudioManager'

class Notoriete extends Page {

  constructor( props ) {

    super( props )
    this.history = props.history
    this.first = true
    this.tuto = false
    this.onRotate = this.onRotate.bind( this )
    this.tutoDisplayer = this.tutoDisplayer.bind( this )

    this.state = {
      render: true
    }

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
    if ( Config.mobileConnect ) Store.socketRoom.on( EventsConstants.ROTATE, this.onRotate )
    else dom.event.on( this.refs.parent, 'click', this.onRotate )
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

    return(
      <div className="page" ref="parent">
        <VideoWrapper ref="videoWrapper" />
        { this.state.render && this.first == true  ? <div className="page__gradient"></div> : null }
        { this.state.render && <div className="page--layout">
          { this.first == true  ? <Chapter chapterText={this.props}/> : null }
          { this.tuto == true  ? <Tuto ref="tuto" tutoText={this.props.tutoText} tutoAnim={this.props.tutoAnim} />: null }
        </div> }
      </div>
    )

  }

  didTransitionOutComplete() {

    super.didTransitionOutComplete()
    this.history.push( this.nextPath )

  }

  onRotate() {

    console.log( 'pinch' )
    if ( !this.first ) return
    this.first = false
    if ( this.transitionSound ) this.transitionSound.fade( 0.25, 0, 500, this.transitionSoundId )
    if ( Config.mobileConnect ) Store.socketRoom.off( EventsConstants.ROTATE, this.onRotate )
    else dom.event.off( this.refs.parent, 'click', this.onRotate )
    this.refs.videoWrapper.start()
    this.setState({ render: false })

  }


  tutoDisplayer( display ){

    this.tuto = display
    this.setState({ render: display })
    setTimeout( () => {

      TweenMax.to( this.refs.tuto, 1, { opacity: 0, onComplete: () => {
        this.tuto = false
        this.setState( { render: false } )
      } } )

    }, 3000)

  }


}

export default Notoriete
