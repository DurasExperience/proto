import Home from './../../app/desktop/components/pages/Home'
import Indochine from './../../app/desktop/components/pages/Indochine'
import NotFound from './../../app/desktop/components/pages/NotFound'
import { Route, Switch } from 'react-router-dom'
import indochineText from './../../../static/assets/texts/chapitres/index.json'


//TODO condi rendering
export default (
  <Switch>
    <Route exact path="/" component={ Home } />
    <Route path="/indochine/01" render={ (props) => <Indochine data={indochineText.indochine} {...props}/> } />
    <Route path="/indochine/02" render={ (props) => <Indochine data={indochineText.indochine} {...props}/> } />
    <Route component={ NotFound } />
  </Switch>
)
