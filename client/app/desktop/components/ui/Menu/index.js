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
          <NavLink ref="about" activeClassName="" to="/a-propos" title="A propos" />
        </div>

        <div className="navigation__chapter">
          <ul ref="chapters" className="navigation__list">
            <li ref="home"> <NavLink to="/" title="" activeClassName=""/> </li>
            <li ref="indochine"> <NavLink to="/indochine/01" title="" activeClassName={(this.props.activeChapter.history.location.pathname == "/indochine/01"  ? 'activeChapter' : '')}/> </li>
            <li ref="troubles"> <NavLink to="/troubles/01" title="" activeClassName={(this.props.activeChapter.history.location.pathname == "/troubles/01"  ? 'activeChapter' : '')}/> </li>
            <li ref="notoriete">  <NavLink to="/notoriete/01" title="" activeClassName={(this.props.activeChapter.history.location.pathname == "/notoriete/01"  ? 'activeChapter' : '')}/> </li>
          </ul>
        </div>

      </div>
    )

  }

}

export default Menu
