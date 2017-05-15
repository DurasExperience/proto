import io from 'socket.io-client'
import AppTemplate from './template'
import InitialState from '../../config/states/initialState'
import Store from './../../flux/store/desktop'
import Config from './../../config'

export default class App {

  constructor(){

    this.socket = io( Config.apiUrl )
    this.roomID = Math.random().toString().slice( 2, 6 )

  }

  init() {

    this.initialState = new InitialState()
    if ( Config.mobileConnect ) this.createRoom()

    ReactDOM.render(
      <AppTemplate />,
      dom.select( '.app' )
    )

  }

  createRoom(){

    const roomID = this.roomID
    this.socket.emit( 'createRoom', this.roomID, () => {

      const socketRoom = io( Config.apiUrl + `/${roomID}` )
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
