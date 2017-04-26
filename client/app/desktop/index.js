import io from 'socket.io-client'
import AppTemplate from './template'
import InitialState from '../../config/states/initialState'
import Store from './../../flux/store/desktop'

export default class App {

  constructor(){

    // this.socket = io('http://172.20.10.2:8000')
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

    const roomID = this.roomID
    this.socket.emit( 'createRoom', this.roomID, () => {

      const socketRoom = io( 'http://172.20.10.2:8000/' + roomID )
      Store.socketRoom = socketRoom
      socketRoom.on( 'synchronisedMobile', () => {

        console.log( 'synchronisedMobile' )
        //todo show mobile connected

      })
      socketRoom.on( 'pinch', () => {

        console.log( 'desktop pinch' )

      })

    })

  }

}
