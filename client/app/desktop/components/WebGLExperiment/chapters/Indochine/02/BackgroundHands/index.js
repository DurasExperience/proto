import Config from './../Config/'
import Store from './../../../../../../../../flux/store/desktop'
import { Object3D, BufferGeometry, BufferAttribute } from 'three'
import ParticlesMesh from './../../../../abstract/ParticlesMesh'
import ParticlesSystem from './../../../../abstract/ParticlesSystem'
import GUI from './../../../../../../../../helpers/GUI'

class BackgroundHands extends Object3D {

  constructor() {

    super()

    // TODO AUDIO
    this.createParticules()

    this.addGUI()

  }

  createParticules(){

    let obj = Store.getResource("hands_particle_background")
    this.particles = new ParticlesSystem( obj )
    this.particles.mesh.name = "hands_particle_background"

  }

  addGUI() {

  }

  update( time ) {

    this.particles.update( time )

  }

}

export default BackgroundHands
