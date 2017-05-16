import { withRouter } from 'react-router'
import Actions from './../../../../../flux/actions'

class Wrapper extends React.Component {

  constructor( props ) {

    super()
    this.props = props

    this.pathname = this.props.location.pathname
    setTimeout( () => { Actions.routeChanged( undefined, this.pathname ) }, 0 )
    
    this.props.history.listen( ( location, action ) => {

      if ( location.pathname !== this.pathname ) {

        setTimeout( () => { Actions.routeChanged( this.pathname, location.pathname ) }, 0 )
        this.pathname = location.pathname

      }

    } )

  }

  render() {

    return(
      <div className="main">
        { this.props.children }
      </div>
    )

  }

}

export default withRouter( Wrapper )
