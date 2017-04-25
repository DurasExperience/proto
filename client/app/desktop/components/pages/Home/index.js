import Page from './../../base/Page'
import './Home.styl'
import EventsConstants from './../../../../../flux/constants/EventsConstants'
import Store from './../../../../../flux/store/desktop'
import bodymovin from 'bodymovin'

class Home extends Page {

  constructor( props ) {

    super( props )
    this.history = props.history
    this.addListener()

  }

  componentDidMount() {

    super.componentDidMount()

  }

  addListener(){

    Store.on( EventsConstants.RESOURCES_READY, this.initSources )

  }

  initSources(){

    this.video = ( Store.getResource('intro') )
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
    this.tlIn.fromTo( this.refs.parent, 0.5, { opacity: 0, x: 500 }, { opacity: 1, x: 0 })
    this.tlOut.fromTo( this.refs.parent, 0.5, { opacity: 1, x: 0 }, { opacity: 0, x: 500 })

  }

  render() {

    return(
      <div className="page" ref="parent" id="Home">
        <h1>Home</h1>
        <div ref="phone"></div>
      </div>
    )

  }
  didTransitionOutComplete() {

    super.didTransitionOutComplete()
    this.history.push( this.nextPath )

  }

}

export default Home
