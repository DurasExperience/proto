import throttle from 'lodash.throttle'
import { Object3D, Vector2, Vector3, Euler } from 'three'

/**
 * @author mrdoob / http://mrdoob.com/
 */

const PointerLockControls = function (camera, position, lookat, fluidity) {

  this.orientation = 1.1

  this.fluidity = fluidity

  camera.rotation.set( 0, 0, 0 )

  this.pitchObject = new Object3D()
  this.pitchObject.add( camera )

  this.yawObject = new Object3D()
  this.yawObject.position.z = position.z
  this.yawObject.position.y = position.y
  this.yawObject.position.x = position.x
  this.yawObject.add( this.pitchObject )

  this.mouse = new Vector2()

  this.yawObject.rotation.y = -3.2
  this.pitchObject.rotation.x = -1

  const onMouseMove = ( event ) => {

    if ( this.enabled === false ) return

    this.mouse.x = event.clientX
    this.mouse.y = event.clientY

    const xRange = 3.6
    const yRange = 2

    const fW = window.innerWidth;
    const fH = window.innerHeight;

    const percX = this.mouse.x / fW;
    const percY = this.mouse.y / fH;

    const newX = -xRange * percX - this.orientation;
    const newY = -yRange * percY + 1;

    TweenLite.to( this.yawObject.rotation, .6, { y: newX })
    TweenLite.to( this.pitchObject.rotation, .6, { x: newY })

  }

  dom.event.on( window, 'mousemove', throttle( onMouseMove, 1 ).bind( this ), false )

  this.enabled = false

  if ( lookat ) camera.lookAt( lookat )

  this.getObject = () => this.yawObject

  this.getPitch = () => this.pitchObject

  this.getDirection = () => {

    // assumes the camera itself is not rotated

    const direction = new Vector3( 0, 0, - 1 )
    const rotation = new Euler( 0, 0, 0, 'YXZ' )

    return (v) => {

      rotation.set( this.pitchObject.rotation.x, this.yawObject.rotation.y, 0 )

      v.copy( direction ).applyEuler( rotation )

      return v

    }

  }

}

export default PointerLockControls
