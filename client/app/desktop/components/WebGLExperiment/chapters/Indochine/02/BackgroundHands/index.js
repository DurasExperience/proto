import Config from './../Config/'
import Store from './../../../../../../../../flux/store/desktop'
import { Object3D, BufferGeometry, BufferAttribute } from 'three'
import ParticlesMesh from './../../../../abstract/ParticlesMesh'
import ParticlesSystem from './../../../../abstract/ParticlesSystem'
import GUI from './../../../../../../../../helpers/GUI'
import AudioManager from './../../../../../../../../helpers/AudioManager'

class BackgroundHands extends Object3D {

  constructor() {

    super()

    // TODO AUDIO
    this.createParticules()
    this.setupSound()
    this.addGUI()

  }

  play(){

    if( this.count == 0 ){

      this.heartbeatId = this.heartbeat.play()
      AudioManager.fade( 'heartbeat', 0, 0.7, 500, this.heartbeatId )
      // TODO change particule size with frequency

      setTimeout( () => this.down(), 2000)

    }
  }

  createParticules(){

    let obj = Store.getResource("hands_particle_background")
    this.particles = new ParticlesSystem( obj )
    this.particles.mesh.name = "hands_particle_background"

  }

  setupSound(){

    this.count = 0
    this.heartbeat = AudioManager.get( 'heartbeat' )

  }

  reverse(){

    this.play()
    this.particles.reverse()
    this.count += 1

  }

  down(){

    AudioManager.fade( 'heartbeat', 0.7, 0, 300, this.heartbeatId )
    setTimeout( () => this.particles.down(), 200)
    this.count = 0

  }

  addGUI() {

  }

  update( time ) {

    this.particles.update( time )

  }

}

export default BackgroundHands
