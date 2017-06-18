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

  render() {

    return(

      <div className="loader" ref="parent">
        <img src="/assets/images/loader.gif" alt=""/>
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
