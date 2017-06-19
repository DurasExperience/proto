import './Menu.styl'
import NavLink from './../NavLink'
import Store from './../../../../../flux/store/desktop'
import EventsConstants from './../../../../../flux/constants/EventsConstants'

class Menu extends React.Component {

  constructor() {
    super()
    this.state = {
      currentRoute: undefined
    }
    this.routeChanged = this.routeChanged.bind( this )
    this.addListeners()
  }

  componentDidMount() {

    this.setupAnimations()

  }

  addListeners() {

    Store.on( EventsConstants.ROUTE_CHANGED, this.routeChanged )

  }

  setupAnimations(){

    const links = Array.prototype.slice.call( this.refs.chapters.children, 0 )
    this.tl = new TimelineMax()
    this.tl.staggerFrom( links, 0.4, { x: 50, opacity: 0 }, 0.2, 0 )

  }

  render() {
    return(
      <div className="navigation" ref="navigation">

        <div className="navigation__about">
          <NavLink ref="about" activeClassName="about" to="/a-propos" title="à propos" />
        </div>

        <div className="navigation__chapter">
          <ul ref="chapters" className="navigation__list">
            <li>
              <NavLink to="/indochine/01" title="indochine" activeClassName={ (this.state.currentRoute === '/indochine/01' || this.state.currentRoute === '/indochine/02') ? 'chapter__active' : 'chapter__inactive' }/>
            </li>
            <li>
              <NavLink to="/troubles/01" title="troubles" activeClassName={ this.state.currentRoute === '/troubles/01' ? 'chapter__active' : 'chapter__inactive' }/>
            </li>
            <li>
              <NavLink to="/notoriete/01" title="notoriete" activeClassName={ this.state.currentRoute === '/notoriete/01' ? 'chapter__active' : 'chapter__inactive' }/>
            </li>
            <li>
              <NavLink to="/duras-song" title="duras song" activeClassName={ this.state.currentRoute === '/duras-song' ? 'chapter__active' : 'chapter__inactive' }/>
            </li>
          </ul>
        </div>

      </div>
    )

  }

  routeChanged( routes ) {

    this.setState({
      currentRoute: routes.newRoute
    })

  }

}

export default Menu
