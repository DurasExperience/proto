const app = require( 'express' )()
const http = require( 'http' ).Server( app )
const io = require( 'socket.io' )( http )

const rooms = {}

app.get('/', function (req, res) { })

io.on( 'connection', ( socket ) => {

  socket.on( 'createRoom', ( id, cb ) => {

    rooms[ id ] = {}
    rooms[ id ].socket = io.of( `/${ id }` )

    rooms[ id ].socket.on( 'connection', ( socket ) => {

      socket.emit( 'synchronisedDesktop' )

    })

    cb()

  })

  socket.on( 'join', ( id, cb ) => {

    let authorized = false
    if( id in rooms ) {
      authorized = true
      rooms[ id ].socket.emit( 'synchronisedMobile' )
    }

    cb( authorized )

  })

})

http.listen( 8000, () => {
  console.log( 'listening on *:8000' )
})
