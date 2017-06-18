import Page from './../../base/Page'
import './Home.styl'
import EventsConstants from './../../../../../flux/constants/EventsConstants'
import Store from './../../../../../flux/store/desktop'
import Actions from './../../../../../flux/actions/index'
import bodymovin from 'bodymovin'
import miniVideo from 'mini-video'
import Synchro from './../../ui/Synchro'
import _ from 'underscore'
import throttle from 'lodash.throttle'

class Home extends Page {

  constructor( props ) {

    super( props )
    this.history = props.history
    this.state = {
      video : true,
      synchro : false
    }
    
    this.bind()

  }

  bind() {

    [ 'showSynchro', 'skipVideo', 'startVideo' ]
      .forEach( ( fn ) => this[ fn ] = this[ fn ].bind( this ) )

    super.bind()

  }

  componentWillMount() {

    Store.on( EventsConstants.RESOURCES_READY, this.startVideo )

  }

  componentDidMount() {

    super.componentDidMount()
    this.mVideo = miniVideo({
      autoplay: true,
      loop: false,
      volume: 1
    })
    this.mVideo.addTo( this.refs.videoContainer )
    this.mVideo.load( '/assets/videos/intro.mp4', null )

    this.mVideo.on('ended', this.showSynchro )

    this.mouseEvent()

  }

  startVideo() {

    this.mVideo.play( 80 )

  }

  skipVideo(){

    this.mVideo.pause()
    this.showSynchro()

  }

  showSynchro() {

    this.removeListeners()
    TweenMax.to( this.refs.videoContainer, 1, { opacity: 0, onComplete: () => {

      this.setState({
        video: false,
        synchro: true
      })
      this.mVideo.clear()

    } } )

  }

  phoneAnimation(){

    this.phone = Store.getResource('phone')

    let animData = {
      container: this.refs.phone,
      enderer: 'svg',
      loop: true,
      autoplay: true,
      path: ''
    }
    let anim = bodymovin.loadAnimation(animData)

  }

  // TODO Make it cleaner
  mouseEvent(){

    let that = this
    this.skipThrottled = _.throttle(() =>{

      TweenMax.to( that.refs.skip, 0.3, { opacity: 1 })
      setTimeout(() => {

        if(that.refs.skip != null){

          TweenMax.to( that.refs.skip, 0.3, { opacity: 0 })

        }

      }, 4000)

    }, 5200, { 'trailing': false, 'leading': true })

    window.addEventListener("mousemove", this.skipThrottled)

  }

  removeListeners(){

    window.removeEventListener("mousemove", this.skipThrottled);

  }

  setupAnimations(){

    super.setupAnimations()
    this.tlIn.set( this.refs.parent, { visibility: 'visible' } )
    this.tlIn.fromTo( this.refs.parent, 0.5, { opacity: 0 }, { opacity: 1 })
    this.tlOut.fromTo( this.refs.parent, 0.5, { opacity: 1 }, { opacity: 0 })

  }

  render() {

    return(
      <div className="page" ref="parent" id="Home">
        { this.state.video ? <div className="video-skip" ref="skip" onClick={ this.skipVideo }>skip</div> : null }
        { this.state.video ? <div className="video-container" ref="videoContainer"></div> : null }
        { this.state.synchro  ? <Synchro /> : null }
      </div>
    )

  }

  didTransitionOutComplete() {

    super.didTransitionOutComplete()
    this.history.push( this.nextPath )

  }

}

export default Home
