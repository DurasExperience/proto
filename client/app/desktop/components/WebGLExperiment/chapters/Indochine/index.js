import { Group } from 'three'
import Mountains from './Mountains'
import Floor from './Floor'

class Indochine extends Group {

  constructor() {

    super()

    this.mountains = new Mountains()
    this.floor = new Floor()

    this.add( this.mountains )
    this.add( this.floor )


  }

  update( time ) {

    this.mountains.update( time )
    this.floor.update( time )

  }

}

export default Indochine