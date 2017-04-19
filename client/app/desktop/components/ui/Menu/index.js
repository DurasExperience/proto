import './Menu.styl'
import NavLink from './../NavLink'

class Menu extends React.Component {

  render() {

    return(
      <div className="navigation">
        <ul className="navigation__list">
          <NavLink to="/" title="Home" />
          <NavLink to="/indochine" title="Indochine" />
        </ul>
      </div>
    )

  }

}

export default Menu
