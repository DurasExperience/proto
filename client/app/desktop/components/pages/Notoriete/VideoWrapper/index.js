import './VideoWrapper.styl'
import AudioManager from './../../../../../../helpers/AudioManager'
import GlobalConfig from './../../../../../../config'
import Store from './../../../../../../flux/store/desktop'
import Actions from './../../../../../../flux/actions'
import EventsConstants from './../../../../../../flux/constants/EventsConstants'
require('gsap/src/uncompressed/plugins/EndArrayPlugin.js')

class VideoWrapper extends React.Component {

  constructor() {

    super()

  }

  componentDidMount() {

    this.blackVideo = Store.getResource( '03_video_black' )
    this.whiteVideo = Store.getResource( '03_video_white' )

    this.refs.videoBlack.appendChild( this.blackVideo )
    this.refs.videoWhite.appendChild( this.whiteVideo )
    
    this.bind()
    this.setupTimeline()

    this.SIDE = 'black'

    dom.event.on( this.blackVideo, 'ended', this.changeChapter )

  }

  bind() {

    [ 'swap', 'changeChapter' ]
      .forEach( ( fn ) => this[ fn ] = this[ fn ].bind( this ) )

  }

  addListeners() {

    if ( GlobalConfig.mobileConnect ) Store.socketRoom.on( EventsConstants.ROTATE, this.swap )
    else Store.on( EventsConstants.SPACE_UP, this.swap )

  }

  setupTimeline() {

    this.pos = {
      current: [ 50, -50, 150, 50, 50, 150, -50, 50 ],
      initial: [ 50, -50, 150, 50, 50, 150, -50, 50 ],
      end: [ -50, 50, 50, 150, 50, 150, -50, 50 ]
    }
    this.swapTl = new TimelineMax({ paused: true, onComplete: () => {
      this.SIDE = 'white'
    } })
    this.swapTl.to( this.pos.current, 1.5, { endArray: this.pos.end, ease: Expo.easeInOut, onUpdate: () => {
      TweenMax.set( this.refs.videoBlack, { clipPath: `polygon( ${this.pos.current[0]}% ${this.pos.current[1]}%, ${this.pos.current[2]}% ${this.pos.current[3]}%, ${this.pos.current[4]}% ${this.pos.current[5]}%, ${this.pos.current[6]}% ${this.pos.current[7]}% )` } )
    } } )
    // this.swapTl.to( this.pos, 1, { current: this.pos.initial }, { current: this.pos.end, onUpdate: () => {
    //   console.log( this.pos.current )
    //   TweenMax.set( this.refs.videoBlack, { clipPath: `polygon( ${this.pos.current[0]}% ${this.pos.current[1]}%, ${this.pos.current[2]}% ${this.pos.initial[3]}%, ${this.pos.initial[4]}% ${this.pos.initial[5]}%, ${this.pos.initial[6]}% ${this.pos.initial[7]}% )` } )
    // } } )
    // this.swapTl.fromTo( this.refs.videoBlack, 1, { clipPath: 'polygon( 50% -50%, 150% 50%, 50% 150%, -50% 50% )' }, { clipPath: 'polygon( -50% 50%, 50% 150%, 50% 150%, -50% 50% )' } )
    this.swapTl.eventCallback( 'onReverseComplete', () => {
      this.SIDE = 'black'
    } )
  }

  render() {

    return (
      <div className="video-wrapper" ref="parent">
        <div className="video__white" ref="videoWhite"></div>
        <div className="video__black" ref="videoBlack"></div>
      </div>
    )

  }

  start() {

    this.blackVideo.play( 0 )
    this.whiteVideo.play( 0 )

    this.voice = AudioManager.get( '03_voice' )
    this.voiceId = this.voice.play()
    this.voice.fade( 0, 1, 500, this.voiceId )

    this.ambient = AudioManager.get( '03_ambient' )
    this.ambientId = this.ambient.play()
    this.ambient.fade( 0, 1, 500, this.ambientId )

    this.addListeners()
    this.tutoTimeout = setTimeout( () => {
      Actions.tutoDisplay( true )
    }, 2000 )

  }

  swap() {

    if ( this.SIDE === 'black' ) this.swapTl.play()
    else this.swapTl.reverse()

  }

  changeChapter() {

    this.voice.fade( 1, 0, 300, this.voiceId )
    this.ambient.fade( 1, 0, 300, this.ambientId )
    clearTimeout( this.tutoTimeout )
    if ( GlobalConfig.mobileConnect ){
      Store.socketRoom.off( EventsConstants.ROTATE, this.swap )
      Store.socketRoom.emit( EventsConstants.CHANGE_CHAPTER )
    }
    else Store.off( EventsConstants.SPACE_UP, this.swap )
    
    Actions.changePage( '/duras-song' )

  }

}

export default VideoWrapper