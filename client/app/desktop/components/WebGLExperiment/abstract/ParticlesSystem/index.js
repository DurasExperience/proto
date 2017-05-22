import Config from './../Config/'
import { Object3D, Texture, Clock, Geometry, Vector3, PointsMaterial, Points, ImageUtils } from 'three'


class ParticlesSystem extends Object3D  {

  constructor( obj ) {

    super()

    this.particleCount = 500
    this.clock = new Clock(true)
    this.particles = new Geometry()


    for (let p = 0; p < this.particleCount; p++) {

      let x = Math.random() * 4000 - 2000
      let y = Math.random() * 800 - 50
      let z = Math.random() * 4000 - 2000

      let particle = new Vector3( x, y, z )

      this.particles.vertices.push( particle )

    }

    let texture = this.createCanvasMaterial('#'+'888888', 64)

    this.particleMaterial = new PointsMaterial({
      size: 4,
      fog: true,
      map: texture,
      opacity: 0.3,
      transparent: true
    })


    this.mesh = new Points(this.particles, this.particleMaterial)

  }

  reverse(){

    this.particleMaterial.map = this.createCanvasMaterial('#'+'ff0000', 64)

  }

  down(){

    this.particleMaterial.map = this.createCanvasMaterial('#'+'888888', 64)

  }

  createCanvasMaterial( color, size ) {

    let matCanvas = document.createElement('canvas')
    matCanvas.width = matCanvas.height = size

    let matContext = matCanvas.getContext('2d')

    let texture = new THREE.Texture(matCanvas)

    let center = size / 2
    matContext.beginPath()
    matContext.arc(center, center, size/2, 0, 2 * Math.PI)
    matContext.closePath()
    matContext.fillStyle = color
    matContext.fill()

    texture.needsUpdate = true

    return texture;

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
