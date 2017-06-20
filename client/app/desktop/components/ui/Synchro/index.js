import './Synchro.styl'
import Actions from './../../../../../flux/actions'
import Store from './../../../../../flux/store/desktop'
import Config from './../../../../../config'


class Synchro extends React.Component {

  constructor( props ){

    super( props )
    this.startExperience = this.startExperience.bind( this )

  }

  componentDidMount() {

    if ( Config.mobileConnect ) {
      Store.socketRoom.on( 'synchronisedMobile', this.startExperience )
      this.transitionIn()
      this.initNumbers()
    }
    else this.startExperience()

  }

  transitionIn( ) {

    const inputs = [ this.refs.number_1, this.refs.number_2, this.refs.number_3, this.refs.number_4 ]
    this.tlIn = new TimelineMax()
    // this.tlIn.timeScale( 0.75 )
    this.tlIn.fromTo( this.refs.title, 1, { opacity: 0, x: -200 }, { opacity: 1, x: 0, ease: Sine.easeOut }, 0 )
    this.tlIn.fromTo( this.refs.text, 1, { opacity: 0, x: -100 }, { opacity: 1, x: 0, ease: Sine.easeOut }, 0.2 )
    this.tlIn.staggerFromTo( inputs, 1, { y: 10, opacity: 0 }, { y: 0, opacity: 1, ease: Sine.easeOut }, 0.25, 0.6 )
    this.tlIn.fromTo( this.refs.noPhone, 0.8, { opacity: 0 }, { opacity: 0.52, ease: Sine.easeOut }, 1 )
  }

  startExperience(){

    // TODO start app here in prod
    // Actions.startApp()
    Actions.changePage('/indochine/01')

  }

  initNumbers(){

    this.refs.number_1.value = Store.roomID.w
    this.refs.number_2.value = Store.roomID.x
    this.refs.number_3.value = Store.roomID.y
    this.refs.number_4.value = Store.roomID.z

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
        <div className="synchro__holder">
          <h2 ref="title"> Synchronisation</h2>
          <div className="text">
            <p ref="text">L’utilisation de votre smartphone est nécessaire tout au long de l’expérience. Pour le synchroniser à votre ordinateur, rendez-vous sur Experience-Duras.fr et saisissez le code suivant : </p>
            <div ref="numbers" className="numbers">
              <input ref="number_1" readOnly></input>
              <input ref="number_2" readOnly></input>
              <input ref="number_3" readOnly></input>
              <input ref="number_4" readOnly></input>
            </div>
          </div>
          <p ref="noPhone" className="noPhone">Je n’ai pas de smartphone</p>
        </div>
      </div>
    )

  }

}

export default Synchro
