import { Group } from 'three'
import Mountains from './Mountains'
import Floor from './Floor'
import Journey from './Journey'
import FloorPath from './FloorPath'

class Indochine extends Group {

  constructor( scene, controlsContainer ) {

    super()

    this.mountains = new Mountains()
    this.floor = new Floor()
    this.journey = new Journey( scene, controlsContainer )
    this.floorPath = new FloorPath( scene, this.floor, this.journey.duration )
    this.journey.init()
    this.journey.createGeometry()
    this.journey.enableSpline()
    this.floorPath.init()
    this.floorPath.createGeometry()
    this.floorPath.enableSpline()

    this.add( this.mountains )
    this.add( this.floor )


  }

  update( time ) {

    this.mountains.update( time )
    this.floor.update( time )
    this.journey.update()
    this.floorPath.update()

  }

}

export default Indochine