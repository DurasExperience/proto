const app = require( 'express' )()
const http = require( 'http' ).Server( app )
const io = require( 'socket.io' )( http )
const find = require( 'lodash.find' )
const findIndex = require( 'lodash.findindex' )
const rooms = []

app.get('/', function (req, res) { })
io.on( 'connection', ( socket ) => {
  
  socket.on( 'createRoom', ( id, cb ) => {

    console.log( `Room n°${id} created` )
    const newRoom = {
      id: id,
      socket: io.of( `/${ id }` )
    }
    rooms.push( newRoom )

    newRoom.socket.on( 'connection', ( roomSocket ) => {
      
      console.log( `Connected to room n°${id}` )
      newRoom.socket.emit( 'synchronisedDesktop' )
      
      roomSocket.on( 'CHANGE_CHAPTER', () => {
        console.log( '1 change chapter' )
        newRoom.socket.emit( 'MOBILE_CHANGE_CHAPTER' ) 
      } )
      roomSocket.on( 'MOBILE_GYRO_MOVE', ( val ) => {
        // console.log( val )
        newRoom.socket.emit( 'GYRO_MOVE', val ) 
      } )
      roomSocket.on( 'MOBILE_PINCH_START', () => {
        newRoom.socket.emit( 'PINCH_START' ) 
      } )
      roomSocket.on( 'MOBILE_PINCH_END', () => {
        newRoom.socket.emit( 'PINCH_END' ) 
      } )
      roomSocket.on( 'MOBILE_PRESS_START', () => {
        console.log( 'press start' )
        newRoom.socket.emit( 'PRESS_START' ) 
      } )
      roomSocket.on( 'MOBILE_PRESS_END', () => {
        console.log( 'press end' )
        newRoom.socket.emit( 'PRESS_END' ) 
      } )
      roomSocket.on( 'MOBILE_ROTATE', () => {
        console.log( 'rotate' )
        newRoom.socket.emit( 'ROTATE' ) 
      } )

    })

    // newRoom.socket.on( 'disconnect', () => {
      
    //   const roomIndex = findIndex( rooms, { id: id } )
    //   console.log( roomIndex, rooms.length )
    //   rooms.splice( roomIndex, 1 )
    //   console.log( rooms.length )

    // })


    cb()

  })

  socket.on( 'join', ( id, cb ) => {

    let authorized = false
    const room = find( rooms, { id: id } )
    if( room !== undefined ) {

      console.log( `Someone joined room n°${id}`)
      authorized = true
      room.socket.emit( 'synchronisedMobile' )

    }

    cb( authorized )

  })


})

http.listen( 8000, () => {

  console.log( 'listening on *:8000' )

})
