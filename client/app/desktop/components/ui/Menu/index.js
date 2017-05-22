import './Menu.styl'
import NavLink from './../NavLink'

class Menu extends React.Component {

  render() {

    return(
      <div className="navigation">

        <div className="navigation__about">
          <NavLink to="/a-propos" title="A propos" />
        </div>

        <div className="navigation__chapter">
          <ul className="navigation__list">
            <li> -- </li>
            <li> ----- </li>
            <li> - </li>
          </ul>
        </div>

      </div>
    )

  }

}

export default Menu
