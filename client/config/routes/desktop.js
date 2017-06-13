import Home from './../../app/desktop/components/pages/Home'
import Layout from './../../app/desktop/components/base/Layout'
import NotFound from './../../app/desktop/components/pages/NotFound'
import { Route, Switch } from 'react-router-dom'
import indochineText from './../../../static/assets/texts/chapitres/index.json'
import Config from './../../config/'
import Store from './../../flux/store/desktop/'
import Actions from './../../flux/actions/'


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
    <PropsRoute path="/indochine/01" component={ Layout } data={indochineText.indochine}/>
    <PropsRoute path="/indochine/02" component={ Layout } data={indochineText.indochine} />
    <PropsRoute path="/troubles/01" component={ Layout } data={indochineText.resistance} />
    <PropsRoute path="/renaissance/01" component={ Layout } data={indochineText.renaissance} />
    <Route component={ NotFound } />
  </Switch>
)
