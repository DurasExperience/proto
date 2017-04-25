import './home.styl'
import Page from './../../base/Page'
import io from 'socket.io-client'
import Store from './../../../../../flux/store/mobile'

class Home extends Page {

  constructor( props ) {

    super( props )
    this.history = props.history

    // this.socket = io('http://172.20.10.2:8000')

  }

  componentDidMount() {

    super.componentDidMount()

  }

  setupAnimations(){

    super.setupAnimations()
    this.tlIn.set( this.refs.parent, { visibility: 'visible' } )
    this.tlIn.fromTo( this.refs.parent, 0.5, { opacity: 0, x: 0 }, { opacity: 1, x: 0 })
    this.tlOut.fromTo( this.refs.parent, 0.5, { opacity: 1, x: 0 }, { opacity: 0, x: 0 })

  }

  connectionSubmitted( e ) {

    e.preventDefault()

    const id = this.refs.field_1.value + this.refs.field_2.value + this.refs.field_3.value + this.refs.field_4.value

    this.socket.emit( 'join', id, ( authorized ) => {

      if( authorized === true ) {

        const socketRoom = io( 'http://172.20.10.2:8000/' + id )
        socketRoom.on( 'synchronisedDesktop', () => {
          
          Store.socketRoom = socketRoom
          this.history.push( '/indochine' )

        })

      }

    })
    return false

  }

  render() {

    return(
      <div className="page" ref="parent">
        <form action="">
          <input ref="field_1" type="number" step="1" min="0" max="1" maxLength="1" />
          <input ref="field_2" type="number" step="1" min="0" max="9" maxLength="1" />
          <input ref="field_3" type="number" step="1" min="0" max="9" maxLength="1" />
          <input ref="field_4" type="number" step="1" min="0" max="9" maxLength="1" />
          <br/>
          <button onClick={ (e) => this.connectionSubmitted(e) }>Connect</button>
        </form>
        <p>Desktop & Smartphone synchronised !</p>
      </div>
    )

  }

  didTransitionOutComplete() {

    super.didTransitionOutComplete()
    this.history.push( this.nextPath )

  }

}

export default Home
