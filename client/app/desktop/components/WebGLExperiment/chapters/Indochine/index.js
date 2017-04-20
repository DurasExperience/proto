import { Group } from 'three'
import Mountains from './Mountains'
import Floor from './Floor'
import Journey from './Journey'

class Indochine extends Group {

  constructor( scene, controlsContainer ) {

    super()

    this.mountains = new Mountains()
    this.journey = new Journey( scene, controlsContainer )
    this.journey.init()
    this.journey.createGeometry()
    this.journey.enableSpline()
    // this.floor = new Floor()

    this.add( this.mountains )
    // this.add( this.floor )


  }

  update( time ) {

    this.mountains.update( time )
    this.journey.update()
    // this.floor.update( time )

  }

}

export default Indochine