import './Loader.styl'
import Store from './../../../../../flux/store/desktop'
import Actions from './../../../../../flux/actions'
import EventsConstants from './../../../../../flux/constants/EventsConstants'

class Loader extends React.Component {

  constructor() {

    super()

  }

  render() {

    return(

      <div className="loader" ref="parent">
        <div className="loader__holder">
          <h1 className="loader__title">Duras</h1>
          <h2 className="loader__subtitle">De la femme à l'œuvre</h2>
        </div>
      </div>

    )

  }

  componentDidMount() {

    this.bind()
    this.addListeners()

  }

  bind() {

    this.onResourceReady = this.onResourceReady.bind( this )

  }

  addListeners() {

    Store.on( EventsConstants.RESOURCES_READY, this.onResourceReady )

  }

  onResourceReady() {

    TweenMax.to( this.refs.parent, 1, { opacity: 0, ease: Sine.easeIn, delay: 1, onComplete: () => {

      this.refs.parent.style.display = 'none'
      Actions.startApp()

    } })

  }

}

export default Loader
