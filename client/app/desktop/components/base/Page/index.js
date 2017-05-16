import './Page.styl'
import Store from './../../../../../flux/store/desktop'
import EventsConstants from './../../../../../flux/constants/EventsConstants'

class Page extends React.Component {

  constructor( props ) {

    super( props )

  }

  componentDidMount() {

    this.bind()
    this.addListeners()
    this.setupAnimations()
    this.transitionIn()

  }

  bind() {

    [ 'transitionIn', 'didTransitionInComplete', 'transitionOut', 'didTransitionOutComplete', 'changeSubpage' ]
      .forEach( ( fn ) => this[ fn ] = this[ fn ].bind( this ) )

  }

  addListeners() {

    Store.on( EventsConstants.TRANSITION_OUT, this.transitionOut )
    Store.on( EventsConstants.CHANGE_SUBPAGE, this.changeSubpage )

  }

  setupAnimations(){

    this.tlIn = new TimelineMax({ paused: true, onComplete: this.didTransitionInComplete })
    this.tlOut = new TimelineMax({ paused: true, onComplete: this.didTransitionOutComplete })

  }

  render() {

    super.render()

  }

  transitionIn() {

    this.tlIn.play( 0 )

  }

  didTransitionInComplete() {

    this.tlIn.eventCallback( 'onComplete', null )

  }

  transitionOut( nextPath ) {

    this.nextPath = nextPath
    this.tlOut.play( 0 )

  }

  changeSubpage( nextPath ) {

    this.nextPath = nextPath
    this.didTransitionOutComplete()

  }

  didTransitionOutComplete() {

    this.tlOut.eventCallback( 'onComplete', null )

  }

  componentWillUnmount() {

    this.tlIn.kill()
    this.tlOut.kill()
    this.tlIn.clear()
    this.tlOut.clear()

  }

}

export default Page
