const app = require( 'express' )()
const http = require( 'http' ).Server( app )
const io = require( 'socket.io' )( http )

const rooms = {}

app.get('/', function (req, res) { })
io.on( 'connection', ( socket ) => {
  
  console.log( socket.id )
  socket.on( 'createRoom', ( id, cb ) => {

    console.log( `Room n°${id} created` )
    rooms[ id ] = {}
    rooms[ id ].socketId = socket.id
    rooms[ id ].socket = io.of( `/${ id }` )

    rooms[ id ].socket.on( 'connection', ( roomSocket ) => {
      
      console.log( `Connected to room n°${id}` )
      roomSocket.emit( 'synchronisedDesktop' )
      roomSocket.on( 'mobilePinch', () => {

        console.log( 'piiinch', socket )
        rooms[ id ].socket.emit( 'pinch' )

      } )

    })


    cb()

  })

  socket.on( 'join', ( id, cb ) => {

    let authorized = false
    if( id in rooms ) {

      console.log( `Someone joined room n°${id}`)
      authorized = true
      rooms[ id ].socket.emit( 'synchronisedMobile' )

    }

    cb( authorized, rooms[ id ].socketId )

  })


})

http.listen( 8000, () => {

  console.log( 'listening on *:8000' )

})
