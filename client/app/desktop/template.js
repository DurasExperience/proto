import AssetsLoader from './../../helpers/AssetsLoader'
import { BrowserRouter as Router } from 'react-router-dom'
import Actions from './../../flux/actions'
import EventsConstants from './../../flux/constants/EventsConstants'
import routes from './../../config/routes/desktop'
import Wrapper from './components/base/Wrapper'
import Loader from './components/base/Loader'
import WebGLExperiment from './components/WebGLExperiment'
import Menu from './../../app/desktop/components/ui/Menu/'
import SoundLevel from './../../app/desktop/components/ui/SoundLevel/'
import Store from './../../flux/store/desktop/'
import _ from 'underscore'

class AppTemplate extends React.Component {

  constructor() {

    super()
    this.initLoader()
    this.fadeIn = this.fadeIn.bind(this)
    this.hidden = true

  }

  componentDidMount(){

    this.addListeners()

  }

  addListeners(){

    let throttled = _.throttle(this.fadeIn, 700, { 'trailing': false, 'leading': true });
    Store.on(EventsConstants.MOUSE_MOVE, throttled)

  }

  fadeIn(){

    this.hidden = false

    TweenMax.to( this.refs.soundLevel.refs.sound, 0.5, { opacity: 1 })
    TweenMax.to( this.refs.menu.refs.navigation, 0.5, { opacity: 1 })
    setTimeout(()=>{

      if(this.hidden)this.fadeOut()
      this.hidden = true

    }, 3800)

  }

  fadeOut(){

    TweenMax.to( this.refs.soundLevel.refs.sound, 0.5, { opacity: 0 })
    TweenMax.to( this.refs.menu.refs.navigation, 0.5, { opacity: 0 })

  }

  render() {

    return(
      <Router>
        <Wrapper>
          <Loader />
          <SoundLevel ref="soundLevel"/>
          <Menu activeChapter={this} ref="menu"/>
          { routes }
          <WebGLExperiment />
        </Wrapper>
      </Router>
    )

  }

  initLoader() {

    this.loader = new AssetsLoader( 'desktop' )
    this.loader.load()

  }

}

export default AppTemplate
