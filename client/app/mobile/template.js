import AssetsLoader from './../../helpers/AssetsLoader'
import { BrowserRouter as Router } from 'react-router-dom'
import Actions from './../../flux/actions'
import EventsConstants from './../../flux/constants/EventsConstants'
import routes from './../../config/routes/mobile'
import Loader from './components/base/Loader'
import Wrapper from './components/base/Wrapper'
import Header from './components/ui/Header'
import InfosFooter from './components/ui/InfosFooter'

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
          <InfosFooter />
          <Header />
        </Wrapper>
      </Router>
    )

  }

  initLoader() {

    this.loader = new AssetsLoader( 'mobile' )
    this.loader.load()

  }

}

export default AppTemplate
