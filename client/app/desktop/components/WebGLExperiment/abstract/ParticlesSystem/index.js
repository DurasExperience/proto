import Config from './../Config/'
import { Object3D, Texture, Clock, Geometry, Vector3, PointsMaterial, Points, ImageUtils } from 'three'


class ParticlesSystem extends Object3D  {

  constructor( obj ) {

    super()
    // config = Config
    // this.config = config
    this.particleCount = 500
    this.clock = new Clock(true)
    this.particles = new Geometry()


    for (let p = 0; p < this.particleCount; p++) {

      let x = Math.random() * 4000 - 2000
      let y = Math.random() * 800 - 50
      let z = Math.random() * 4000 - 2000

      // Create the vertex
      let particle = new Vector3( x, y, z )

      // Add the vertex to the geometry
      this.particles.vertices.push( particle )

    }

    ImageUtils.crossOrigin = '*'
    let texture = ImageUtils.loadTexture( obj.file.src)
    texture.needsUpdate = true
    this.particleMaterial = new PointsMaterial({
      size: 4,
      map: texture,
      opacity: 1,
      transparent: true
    })

    this.mesh = new Points(this.particles, this.particleMaterial)

  }

  update() {

    this.deltaTime = this.clock.getDelta()

    let verts = this.mesh.geometry.vertices

    for(let i = 0; i < verts.length; i++) {

      let vert = verts[i]

      if (vert.y < -200) {

        vert.y = Math.random() * 800 - 50

      }

      vert.y = vert.y - (10 * this.deltaTime)

    }

    this.mesh.geometry.verticesNeedUpdate = true

  }

}

export default ParticlesSystem
