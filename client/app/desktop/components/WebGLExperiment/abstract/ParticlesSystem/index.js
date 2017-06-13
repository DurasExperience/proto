import Config from './../Config/'
import { Object3D, Texture, Clock, Geometry, Vector3, PointsMaterial, Points, ImageUtils } from 'three'


class ParticlesSystem extends Object3D  {

  constructor( obj ) {

    super()

    this.particleCount = 500
    this.clock = new Clock(true)
    this.particles = new Geometry()


    for (let p = 0; p < this.particleCount; p++) {

      let x = Math.random() * (1200 - -1200) + -1200
      let y = Math.random() * (1100 - -600) + -600
      let z = Math.random() * (1100 - -1100) + -1100

      let particle = new Vector3( x, y, z )

      this.particles.vertices.push( particle )

    }

    let texture = this.createCanvasMaterial('#'+'dcdded', 32)

    this.particleMaterial = new PointsMaterial({
      size: 8,
      fog: true,
      map: texture,
      opacity: 0.6,
      transparent: true
    })


    this.mesh = new Points(this.particles, this.particleMaterial)

  }

  reverse(){

    this.particleMaterial.map = this.createCanvasMaterial('#'+'ff0000', 64)

    this.tl = new TimelineMax({ restart: 1 })
    this.tl.to( this.particleMaterial, 0.5, { size: 24 }, 0)

  }

  down(){

    this.particleMaterial.map = this.createCanvasMaterial('#'+'dcdded', 32)
    this.tl.reverse()

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

      vert.y = vert.y - (10 * this.deltaTime)

    }

    this.mesh.geometry.verticesNeedUpdate = true

  }

}

export default ParticlesSystem
