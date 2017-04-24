import { BrowserRouter as Router } from 'react-router-dom'
import Actions from './../../flux/actions'
import EventsConstants from './../../flux/constants/EventsConstants'
import routes from './../../config/routes/mobile'
import Wrapper from './components/base/Wrapper'

class AppTemplate extends React.Component {

  constructor() {

    super()

  }

  render() {

    return(
      <Router>
        <Wrapper>
          { routes }
        </Wrapper>
      </Router>
    )

  }

}

export default AppTemplate
