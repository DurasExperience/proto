import Home from './../../app/desktop/components/pages/Home'
import Layout from './../../app/desktop/components/base/Layout'
import NotFound from './../../app/desktop/components/pages/NotFound'
import { Route, Switch } from 'react-router-dom'
import { chapters as Chapters } from './../../data'
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
    <PropsRoute path="/indochine/01" component={ Layout } data={ Chapters.indochine }/>
    <PropsRoute path="/troubles/01" component={ Layout } data={ Chapters.resistance } />
    <PropsRoute path="/notoriete/01" component={ Layout } data={ Chapters.notoriete } />
    <PropsRoute path="/duras-song" component={ Layout } data={ Chapters.durasSong } />
  </Switch>
)
