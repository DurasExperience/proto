const gyro = require( './../../../utils/libs/gyro' )
import Store from './../../../flux/store/mobile'

class Gyroscope {

  constructor() {

    this.DELTA_TIME = 0
    this.SPEED = 0.01
    this.VALUES = {
      x: 0,
      y: 0
    }

  }

  init() {

    console.log( gyro )
    gyro.calibrate()
    gyro.frequency = 300
    gyro.startTracking( ( e ) => {
      const rX = Math.floor( e.x )
      if ( rX !== this.VALUES.x ) {
        this.VALUES.x = rX
        Store.socketRoom.socket.emit( 'MOBILE_GYRO_MOVE', this.VALUES )
      }
    } )
    // this.loop = loop( this.update )
    // this.loop.start()

  }

}

export default new Gyroscope