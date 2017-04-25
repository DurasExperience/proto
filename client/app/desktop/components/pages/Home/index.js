import Page from './../../base/Page'
import './Home.styl'
import EventsConstants from './../../../../../flux/constants/EventsConstants'
import Store from './../../../../../flux/store/desktop'
import bodymovin from 'bodymovin'
import miniVideo from 'mini-video'

class Home extends Page {

  constructor( props ) {

    super( props )
    this.history = props.history
    // this.addListeners()

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

      // dom.classes.add(this.refs.parent, 'active')
      this.mVideo.play( 0 )

    })
    this.mVideo.on('ended', () => this.history.push( '/indochine' ) )

  }

  addListeners(){

    // Store.on( EventsConstants.RESOURCES_READY, this.initSources )

  }

  initSources(){

    // this.video = ( Store.getResource('intro') )
    this.phone = Store.getResource('phone')


    console.log( this.video, this.phone )

  }

  phoneAnimation(){

    this.phone = Store.getResource('phone')

    let animData = {
      container: this.refs.phone,
      enderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'https://labs.nearpod.com/bodymovin/demo/the_lady/data.json'
    }
    let anim = bodymovin.loadAnimation(animData)

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
        <div className="video-container" ref="videoContainer"></div>
      </div>
    )

  }
  didTransitionOutComplete() {

    super.didTransitionOutComplete()
    this.history.push( this.nextPath )

  }

}

export default Home
