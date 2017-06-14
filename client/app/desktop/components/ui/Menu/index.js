import './Menu.styl'
import NavLink from './../NavLink'

class Menu extends React.Component {

  componentDidMount() {

    this.setupAnimations()

  }

  componentWillMount() {

  }

  setupAnimations(){

    this.tl = new TimelineMax()
    this.tl.from( this.refs.home, 0.4, { x: 50, alpha: 0 }, 0 )
    this.tl.from( this.refs.indochine, 0.4, { x: 50, alpha: 0 }, 0.3 )
    this.tl.from( this.refs.troubles, 0.4, { x: 50, alpha: 0 }, 0.6 )
    this.tl.from( this.refs.notoriete, 0.4, { x: 50, alpha: 0 }, 0.9 )

  }

  render() {

    return(
      <div className="navigation">

        <div className="navigation__about">
          <div className="about" >À propos</div>
          <NavLink ref="about" activeClassName="about" to="/a-propos" title="à propos" />
        </div>

        <div className="navigation__chapter">
          <ul ref="chapters" className="navigation__list">
            <li ref="home">
              <NavLink to="/" title="introduction" activeClassName={(this.props.activeChapter.history.location.pathname == "/"  ? 'chapter__active' : 'chapter__inactive')}/>
            </li>
            <li ref="indochine">
              <NavLink to="/indochine/01" title="indochine" activeClassName={(this.props.activeChapter.history.location.pathname == "/indochine/01" || "/indochine/02"  ? 'chapter__active' : 'chapter__inactive')}/>
            </li>
            <li ref="troubles">
              <NavLink to="/troubles/01" title="troubles" activeClassName={(this.props.activeChapter.history.location.pathname == "/troubles/01"  ? 'chapter__active' : 'chapter__inactive')}/>
            </li>
            <li ref="notoriete">
              <NavLink to="/notoriete/01" title="notoriete" activeClassName={(this.props.activeChapter.history.location.pathname == "/notoriete/01"  ? 'chapter__active' : 'chapter__inactive')}/>
            </li>
          </ul>
        </div>

      </div>
    )

  }

}

export default Menu
