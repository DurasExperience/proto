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
    this.video = true
    this.synchro = false
    this.skipVideo = this.skipVideo.bind(this)

  }

  componentDidMount() {

    super.componentDidMount()
    this.mVideo = miniVideo({
      autoplay: true,
      loop: false,
      volume: 1
    })
    this.mVideo.addTo( this.refs.videoContainer )
    this.mVideo.load( '/assets/videos/intro.mp4', () => {

      this.mVideo.play( 85 )

    })

    this.mVideo.on('ended', () =>{
      this.videoEnded()
    })

    this.mouseEvent()
  }

  skipVideo(){

    this.mVideo.pause()
    this.videoEnded()

  }

  videoEnded(){

    this.removeListeners()
    this.video = false
    this.synchro = true
    this.setState({ render: true })

  }

  initSources(){

    // this.video = ( Store.getResource('intro') )
    // this.phone = Store.getResource('phone')
    // console.log( this.video, this.phone )

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
        {(this.video == true ? <div className="video-skip" ref="skip"  onClick={this.skipVideo}> skip </div>: null)}
        {(this.video == true  ? <div className="video-container" ref="videoContainer"></div>: null)}
        {(this.synchro == true  ? <Synchro />: null)}
      </div>
    )

  }

  didTransitionOutComplete() {

    super.didTransitionOutComplete()
    this.history.push( this.nextPath )

  }

}

export default Home
