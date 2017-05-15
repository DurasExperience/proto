import './Indochine.styl'
import Page from './../../base/Page'
import miniVideo from 'mini-video'
import Store from './../../../../../flux/store/desktop/index'
import Actions from './../../../../../flux/actions'
import Config from './../../../../../config'

class Indochine extends Page {

  constructor( props ) {

    super( props )
    this.history = props.history
    this.first = true
    this.onPinch = this.onPinch.bind( this )

  }

  componentDidMount() {

    super.componentDidMount()
    
    if ( Config.mobileConnect ) Store.socketRoom.on( 'pinch', this.onPinch )
    else dom.event.on( this.refs.parent, 'click', this.onPinch )
    // this.mVideo = miniVideo({
    //   autoplay: true,
    //   loop: false,
    //   volume: 1
    // })
    // this.mVideo.addTo( this.refs.videoContainer )
    // this.mVideo.load( '/assets/videos/chap1.mov', () => {

    //   // dom.classes.add(this.refs.parent, 'active')
    //   this.mVideo.play( 0 )

    // })
    // this.mVideo.on('ended', () => this.history.push( '/indochine' ) )

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
        <div className="page__gradient"></div>
        <div className="page--indochine"></div>
      </div>
    )

  }
  didTransitionOutComplete() {

    super.didTransitionOutComplete()
    this.history.push( this.nextPath )

  }

  onPinch() {

    if ( !this.first ) return
    this.first = false
    console.log( 'start' )
    TweenMax.to( this.refs.parent, 0.2, { opacity: 0, onComplete: () => setTimeout( Actions.startChapter ) } )

  }

}

export default Indochine
