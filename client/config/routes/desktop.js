import Home from './../../app/desktop/components/pages/Home'
import Layout from './../../app/desktop/components/base/Layout'
import Layout2 from './../../app/desktop/components/base/Layout2'
import NotFound from './../../app/desktop/components/pages/NotFound'
import { Route, Switch } from 'react-router-dom'
import { chapters as Chapters } from './../../data'
import { tutoriels as Tutoriels } from './../../data'
import Config from './../../config/'
import Store from './../../flux/store/desktop/'
import Actions from './../../flux/actions/'


const PropsRoute = ({ path, component, data, tuto }) => {
  return (
    <Route path={path} render={ (props) => {
      const finalProps = Object.assign(data, tuto, props );
      if(Config.layout){
        console.log( component, finalProps )
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
    <PropsRoute path="/indochine/01" component={ Layout } data={ Chapters.indochine } tuto={ Tutoriels.indochine }/>
    <PropsRoute path="/troubles/01" component={ Layout } data={ Chapters.resistance } tuto={ Tutoriels.resistance } />
    <PropsRoute path="/notoriete/01" component={ Layout } data={ Chapters.notoriete } tuto={ Tutoriels.notoriete } />
    <PropsRoute path="/duras-song" component={ Layout2 } data={ Chapters.durasSong } />
  </Switch>
)
