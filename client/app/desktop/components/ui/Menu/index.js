import './Menu.styl'
import NavLink from './../NavLink'

class Menu extends React.Component {

  componentDidMount() {

  }

  componentWillMount() {

  }

  render() {

    return(
      <div className="navigation">

        <div className="navigation__about">
          <NavLink ref="about" activeClassName="about" to="/a-propos" title="à propos" />
        </div>

        <div className="navigation__chapter">
          <ul ref="chapters" className="navigation__list">
            <li ref="home">
              <NavLink to="/" title=" " activeClassName={(this.props.activeChapter.history.location.pathname == "/"  ? 'chapter__active' : 'chapter__inactive')}/>
            </li>
            <li ref="indochine">
              <NavLink to="/indochine/01" title=" " activeClassName={(this.props.activeChapter.history.location.pathname == "/indochine/01"  ? 'chapter__active' : 'chapter__inactive')}/>
            </li>
            <li ref="troubles">
              <NavLink to="/troubles/01" title=" " activeClassName={(this.props.activeChapter.history.location.pathname == "/troubles/01"  ? 'chapter__active' : 'chapter__inactive')}/>
            </li>
            <li ref="notoriete">
              <NavLink to="/notoriete/01" title=" " activeClassName={(this.props.activeChapter.history.location.pathname == "/notoriete/01"  ? 'chapter__active' : 'chapter__inactive')}/>
            </li>
          </ul>
        </div>

      </div>
    )

  }

}

export default Menu
