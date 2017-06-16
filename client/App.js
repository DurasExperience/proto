import DesktopApp from './app/desktop'
import MobilepApp from './app/mobile'
import MobileDetect from 'mobile-detect'
import './style/app.styl'

const md = new MobileDetect( window.navigator.userAgent )
const mobile = (md.mobile() || md.tablet()) ? true : false

if( mobile == false ) {

  const App = new DesktopApp()
  App.init()

}else {

  const App = new MobilepApp()
  App.init()

}
