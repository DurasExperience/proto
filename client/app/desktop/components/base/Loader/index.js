import './Loader.styl'
import Store from './../../../../../flux/store/desktop'
import Actions from './../../../../../flux/actions'
import EventsConstants from './../../../../../flux/constants/EventsConstants'

class Loader extends React.Component {

  constructor() {

    super()
    this.bind()
    this.addListeners()

  }

  componentDidMount() {

    this.spriteTween = TweenMax.to( this.refs.sprite, 2, { backgroundPosition: '-18375px 0', ease: SteppedEase.config(84), repeat: -1, paused: true } )
    TweenMax.to( this.refs.sprite, 0.5, { opacity: 1, onComplete: () => {
      this.spriteTween.play()
    } } )

  }

  render() {

    return(

      <div className="loader" ref="parent">
        <div className="loader__sprite" ref="sprite"></div>
      </div>

    )

  }

  bind() {

    this.onResourceReady = this.onResourceReady.bind( this )

  }

  addListeners() {

    Store.on( EventsConstants.RESOURCES_READY, this.onResourceReady )

  }


  onResourceReady() {

    TweenMax.to( this.refs.parent, 1, { opacity: 0, ease: Sine.easeIn, delay: 1, onComplete: () => {

      // TODO Remove it from loader after dev
      Actions.startApp()
      this.refs.parent.style.display = 'none'

    } })

  }

}

export default Loader
