import './home.styl'
import Page from './../../base/Page'
import SynchroSuccess from './SynchroSuccess'
import io from 'socket.io-client'
import Store from './../../../../../flux/store/mobile'
import Config from './../../../../../config'
import GlobalConfig from './../../../../../config'
import EventsConstants from './../../../../../flux/constants/EventsConstants'

class Home extends Page {

  constructor( props ) {

    super( props )
    this.history = props.history
    this.state = {
      synchro : false
    }
  
    if ( GlobalConfig.mobileConnect ) {

      this.socket = io( Config.apiUrl )

    }
    this.connectionSubmitted = this.connectionSubmitted.bind( this )
    this.playAnim = this.playAnim.bind( this )
    this.nextFocus = this.nextFocus.bind( this )
    Store.on( EventsConstants.APP_START, this.playAnim )

  }

  componentDidMount() {

    super.componentDidMount()

  }

  setupAnimations(){

    super.setupAnimations()
    this.tlIn.set( this.refs.parent, { visibility: 'visible' } )
    this.tlOut.fromTo( this.refs.parent, 0.5, { opacity: 1, x: 0 }, { opacity: 0, x: 0 })

  }

  playAnim() {

    const inputs = [ this.refs.field_1, this.refs.field_2, this.refs.field_3, this.refs.field_4 ]
    this.enterTl = new TimelineMax()
    this.enterTl.fromTo( this.refs.title, 0.3, { x: -20, opacity: 0 }, { x: 0, opacity: 1, ease: Sine.easeOut }, 0 )
    this.enterTl.fromTo( this.refs.info_1, 0.3, { x: -20, opacity: 0 }, { x: 0, opacity: 1, ease: Sine.easeOut }, 0.2 )
    this.enterTl.staggerFromTo( inputs, 0.3, { y: 10, opacity: 0 }, { y: 0, opacity: 1, ease: Sine.easeOut }, 0.25, 0.3 )
    this.enterTl.fromTo( this.refs.example, 0.3, { opacity: 0 }, { opacity: 0.67, ease: Sine.easeOut }, 0.6 )
    this.enterTl.fromTo( this.refs.info_2, 0.3, { x: -20, opacity: 0 }, { x: 0, opacity: 1, ease: Sine.easeOut }, 0.9 )

  }

  nextFocus( currentField, nextField ) {

    if ( currentField.value === '' ) return
    nextField.focus()

  }

  connectionSubmitted( e ) {

    e.preventDefault()

    const id = this.refs.field_1.value + this.refs.field_2.value + this.refs.field_3.value + this.refs.field_4.value
    if ( id.length < 4 ) return
    if ( !GlobalConfig.mobileConnect ) {

      TweenMax.to( this.refs.synchronisation, 0.5, { opacity: 0, ease: Sine.easeOut, onComplete: () => {
        this.setState({
          synchro: true
        })
      } } )

      return false

    }
    this.socket.emit( 'join', id, ( authorized ) => {

      if( authorized === true ) {

        const socketRoom = io( Config.apiUrl + `/${id}` )
        socketRoom.on( 'synchronisedDesktop', () => {
          
          Store.socketRoom = {
            socket: socketRoom
          }
          TweenMax.to( this.refs.synchronisation, 0.5, { opacity: 0, ease: Sine.easeOut, onComplete: () => {
            this.setState({
              synchro: true
            })
          } } )
        })

      } else {

        dom.classes.remove( this.refs.error, 'error--inactive' )

      }

    })
    return false

  }

  componentDidUpdate() {

    this.refs.synchroSuccess.start()

  }

  render() {

    return(
      <div className="page page--home" ref="parent">
        { !this.state.synchro ? <div className="synchronisation" ref="synchronisation">
          <h3 ref="title">Synchronisation</h3>
          <p className="info" ref="info_1">Votre téléphone va vous permettre de naviguer dans cette expérience.<br/>Synchronisez le avec votre ordinateur en saisissant votre code.</p>
          <div className="form-holder">
            <form action="">
              <div className="inputs-holder">
                <input ref="field_1" type="tel" pattern="^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$" maxLength="1" onChange={ () => { this.nextFocus( this.refs.field_1, this.refs.field_2 ) } } />
                <input ref="field_2" type="tel" pattern="^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$" maxLength="1" onChange={ () => { this.nextFocus( this.refs.field_2, this.refs.field_3 ) } } />
                <input ref="field_3" type="tel" pattern="^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$" maxLength="1" onChange={ () => { this.nextFocus( this.refs.field_3, this.refs.field_4 ) } } />
                <input ref="field_4" type="tel" pattern="^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$" maxLength="1" onChange={ this.connectionSubmitted } />
              </div>
              <br/>
            </form>
            <p className="example" ref="example">ex: 1234</p>
            <p className="error error--inactive" ref="error">Probleme survenu lors de la synchronisation, veuillez relancer la page sur votre ordinateur pour générer un nouveau code.</p>
          </div>
          <p className="info" ref="info_2">Vous n’avez pas votre code ? Rendez-vous sur Experience-Duras.fr à partir d’un ordinateur pour en obtenir un.</p>
        </div> : null }
        { this.state.synchro ? <SynchroSuccess ref="synchroSuccess" /> : null }
      </div>
    )

  }

  didTransitionOutComplete() {

    super.didTransitionOutComplete()
    this.history.push( this.nextPath )

  }

}

export default Home
