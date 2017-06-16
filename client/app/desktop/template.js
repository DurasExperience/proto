import AssetsLoader from './../../helpers/AssetsLoader'
import { BrowserRouter as Router } from 'react-router-dom'
import Actions from './../../flux/actions'
import EventsConstants from './../../flux/constants/EventsConstants'
import routes from './../../config/routes/desktop'
import Wrapper from './components/base/Wrapper'
import Menu from './components/ui/Menu'
import SoundLevel from './components/ui/SoundLevel'
import Loader from './components/base/Loader'
import WebGLExperiment from './components/WebGLExperiment'

class AppTemplate extends React.Component {

  constructor() {

    super()
    this.initLoader()

  }

  render() {

    return(
      <Router>
        <Wrapper>
          <Loader />
          { routes }
          <SoundLevel />
          <Menu />
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
