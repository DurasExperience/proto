import io from "socket.io-client"
import AppTemplate from './template'
import InitialState from '../../config/initialState'

export default class App {

  constructor(){

    // this.socket = io('http://localhost:8000')
    this.roomID = "0000"

  }

  init() {

    this.initialState = new InitialState()
    // this.createRoom()

    ReactDOM.render(
      <AppTemplate />,
      dom.select( '.app' )
    )

  }

  createRoom(){

    this.socket.emit( 'createRoom', this.roomID, function() {

      let socketRoom = io( '/' + this.roomID )
      socketRoom.on( 'synchronisedMobile', function(){

        console.log( "synchronisedMobile" )
        //todo show mobile connected

      })

    })

  }

}
