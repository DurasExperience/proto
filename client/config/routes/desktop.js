import Home from './../../app/desktop/components/pages/Home'
import Indochine from './../../app/desktop/components/pages/Indochine'
import NotFound from './../../app/desktop/components/pages/NotFound'
import { Route, Switch } from 'react-router-dom'
import indochineText from './../../../static/assets/texts/chapitres/index.json'
import Config from './../../config/'
import Store from './../../flux/store/desktop/'
import Actions from './../../flux/actions/'

//TODO Store.Routes.oldRoute != "/indochine/01"
// console.log( Store.Routes );

const PropsRoute = ({ path, component, data }) => {
  return (
    <Route path={path} render={ (props) => {
      const finalProps = Object.assign(data, props );
      if(Config.layout){
        return React.createElement(component, finalProps)
      }else{
        return false
      }
    }}/>
  );
}

export default (
  <Switch>
    <Route exact path="/" component={ Home } />
    <PropsRoute path="/indochine/01" component={ Indochine } data={indochineText.indochine}/>
    <PropsRoute path="/indochine/02" component={ Indochine } data={indochineText.indochine} />
    <Route component={ NotFound } />
  </Switch>
)
