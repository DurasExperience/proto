import Page from './../../base/Page'
import './About.styl'
import EventsConstants from './../../../../../flux/constants/EventsConstants'
import Store from './../../../../../flux/store/desktop'
import Actions from './../../../../../flux/actions/index'


class Home extends Page {

  constructor( props ) {

    super( props )

  }

  componentDidMount(){

  }

  render() {

    return(
      <div className="page" ref="parent" id="About">
      </div>
    )

  }


}

export default About
