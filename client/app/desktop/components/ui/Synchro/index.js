import './Synchro.styl'
import Actions from './../../../../../flux/actions'

class Synchro extends React.Component {

  constructor( props ){

    super( props )
    this.startExperience = this.startExperience.bind(this)
    let that = this

    window.onkeypress = function( e ){

      if (!e) e = window.event
      let keyCode = e.keyCode || e.which

      if (keyCode == '13'){


        that.startExperience()

        return false

      }

    }

  }


  startExperience(){

    Actions.changePage('/indochine/01')

  }


  render() {

    return(
      <div className="synchro">
        <div>
          <h2 ref="title"> Synchronisation</h2>
          <div>
            <div ref="text" className="text">
              <h5>L’utilisation de votre smartphone est nécessaire pour controler l’expérience. Pour le synchroniser à votre ordinateur,  rendez-vous sur Experience-Duras.fr et saisissez le code suivant : </h5>
              <div ref="numbers" className="numbers">
                <input></input>
                <input></input>
                <input></input>
                <input></input>
              </div>
            </div>
          </div>
          <div ref="noPhone" className="noPhone">Je n’ai pas de smartphone</div>
        </div>
      </div>
    )

  }

}

export default Synchro
