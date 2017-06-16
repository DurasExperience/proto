import './Header.styl'
import BurgerMenu from './BurgerMenu'
import ChapterHeader from './ChapterHeader'

class Header extends React.Component {

  render() {
    
    return (
      <header className="header-navigation">
        <BurgerMenu />
        <ChapterHeader />
      </header>
    )

  }

}

export default Header