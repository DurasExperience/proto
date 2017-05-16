import Home from './../../app/desktop/components/pages/Home'
import Indochine from './../../app/desktop/components/pages/Indochine'
import NotFound from './../../app/desktop/components/pages/NotFound'
import { Route, Switch } from 'react-router-dom'


export default (
  <Switch>
    <Route exact path="/" component={ Home } />
    <Route path="/indochine/01" component={ Indochine } />
    <Route path="/indochine/02" />
    <Route component={ NotFound } />
  </Switch>
)
