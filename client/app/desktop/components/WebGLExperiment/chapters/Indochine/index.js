import { Group } from 'three'
import Floor from './Floor'

class Indochine extends Group {

  constructor() {

    super()

    this.floor = new Floor()

    this.add( this.floor )


  }

  update( time ) {

    this.floor.update( time )

  }

}

export default Indochine