import Home from './../../app/mobile/components/pages/Home'
import Indochine from './../../app/mobile/components/pages/Indochine'
import Troubles from './../../app/mobile/components/pages/Troubles'
import { Route, Switch } from 'react-router-dom'


export default (
  <Switch>
    <Route exact path="/" component={ Home } />
    <Route path="/indochine" component={ Indochine } />
    <Route path="/troubles" component={ Troubles } />
  </Switch>
)
