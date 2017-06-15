import Page from './../../base/Page'
import './Home.styl'
import EventsConstants from './../../../../../flux/constants/EventsConstants'
import Store from './../../../../../flux/store/desktop'
import Actions from './../../../../../flux/actions/index'
import bodymovin from 'bodymovin'
import miniVideo from 'mini-video'
import Synchro from './../../ui/Synchro'

class Home extends Page {

  constructor( props ) {

    super( props )
    this.history = props.history
    this.video = true
    this.synchro = false

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

      this.mVideo.play( 0 )

    })

    this.mVideo.on('ended', () =>{
      // this.video = false
      // this.synchro = true
      // this.setState({ render: true })
      Actions.changePage('/indochine/01')
    })

    //TODO input enter
  }


  initSources(){

    // this.video = ( Store.getResource('intro') )
    //this.phone = Store.getResource('phone')
    //console.log( this.video, this.phone )

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

  setupAnimations(){

    super.setupAnimations()
    this.tlIn.set( this.refs.parent, { visibility: 'visible' } )
    this.tlIn.fromTo( this.refs.parent, 0.5, { opacity: 0 }, { opacity: 1 })
    this.tlOut.fromTo( this.refs.parent, 0.5, { opacity: 1 }, { opacity: 0 })

  }

  render() {

    return(
      <div className="page" ref="parent" id="Home">
        {(this.video == true  ? <div className="video-container" ref="videoContainer"></div>: null)}
        {(this.synchro == true  ? <Synchro />: null)}
      </div>
    )

  }

}

export default Home
