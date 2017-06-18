const gyro = require( './../../../utils/libs/gyro' )
import Store from './../../../flux/store/mobile'

class Gyroscope {

  constructor() {

    this.DELTA_TIME = 0
    this.SPEED = 0.01

  }

  init() {

    console.log( gyro )
    gyro.calibrate()
    gyro.startTracking( ( e ) => {
      const val = {
        x: Math.floor( e.x ),
        y: Math.floor( e.y )
      }
      Store.socketRoom.socket.emit( 'MOBILE_GYRO_MOVE', val )
    } )
    // this.loop = loop( this.update )
    // this.loop.start()

  }

}

export default new Gyroscope