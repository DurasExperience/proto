import Home from './../../app/mobile/components/pages/Home'
import Indochine from './../../app/mobile/components/pages/Indochine'
import Troubles from './../../app/mobile/components/pages/Troubles'
import Notoriete from './../../app/mobile/components/pages/Notoriete'
import DurasSong from './../../app/mobile/components/pages/DurasSong'
import { Route, Switch } from 'react-router-dom'


export default (
  <Switch>
    <Route exact path="/" component={ Home } />
    <Route path="/indochine" component={ Indochine } />
    <Route path="/troubles" component={ Troubles } />
    <Route path="/notoriete" component={ Notoriete } />
    <Route path="/duras-song" component={ DurasSong } />
  </Switch>
)
