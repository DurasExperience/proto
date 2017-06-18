import './Synchro.styl'
import Actions from './../../../../../flux/actions'
import Store from './../../../../../flux/store/desktop/'
import EventsConstants from './../../../../../flux/constants/EventsConstants.js'

class Synchro extends React.Component {

  constructor( props ){

    super( props )
    this.startExperience = this.startExperience.bind(this)
    this.noPhone = this.noPhone.bind(this)

  }

  componentDidMount(){

    this.initNumbers()
    this.setupAnimations()

  }

  noPhone(){

    this.startExperience()

  }

  startExperience(){

    Actions.changePage('/indochine/01')

  }

  initNumbers( roomID ){

    this.refs.number1.innerHTML = Store.roomID.w
    this.refs.number2.innerHTML = Store.roomID.x
    this.refs.number3.innerHTML = Store.roomID.y
    this.refs.number4.innerHTML = Store.roomID.z

  }

  setupAnimations(){

    this.tl = new TimelineMax({ delay: 1 })
    this.tl.from( this.refs.title, 1, { x: -200, opacity: 0 }, 0 )
    this.tl.from( this.refs.text, 1, { x: 200, opacity: 0 }, 0 )
    this.tl.from( this.refs.numbers, 1, { x: 200, opacity: 0 }, 0 )
    this.tl.from( this.refs.noPhone, 1, { x: 200, opacity: 0 }, 0 )

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
                <div className="number" ref="number1"></div>
                <div className="number" ref="number2"></div>
                <div className="number" ref="number3"></div>
                <div className="number" ref="number4"></div>
              </div>
            </div>
          </div>
          <div ref="noPhone" className="noPhone" onClick={this.noPhone}>Je n’ai pas de smartphone</div>
        </div>
      </div>
    )

  }

}

export default Synchro
