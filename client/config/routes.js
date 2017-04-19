import Home from './../app/desktop/components/pages/Home'
import Indochine from './../app/desktop/components/pages/Indochine'
import NotFound from './../app/desktop/components/pages/NotFound'
import { Route, Switch } from 'react-router-dom'


export default (
  <Switch>
    <Route exact path="/" component={ Home } />
    <Route path="/indochine" component={ Indochine } />
    <Route component={ NotFound } />
  </Switch>
)
