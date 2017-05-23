import Actions from './../../flux/actions/'


const KEY_STATE = {
  DOWN: 'DOWN',
  UP: 'UP'
}

class InitialState {

  constructor(){

    this.bind()
    this.addListeners()
    this.keyState = undefined

  }

  bind() {

    [ 'onWindowResize', 'onMouseMove', 'onMouseUp', 'onMouseDown', 'onWindowBlur', 'onWindowFocus', 'onKeyDown', 'onKeyUp' ]
      .forEach( ( fn ) => this[ fn ] = this[ fn ].bind( this ) )

  }

  addListeners() {

    dom.event.on( window, 'resize', this.onWindowResize )
    dom.event.on( window, 'mousemove', this.onMouseMove )
    dom.event.on( window, 'mouseup', this.onMouseUp )
    dom.event.on( window, 'mousedown', this.onMouseDown )
    dom.event.on( window, 'blur', this.onWindowBlur )
    dom.event.on( window, 'focus', this.onWindowFocus )
    dom.event.on( window, 'keydown', this.onKeyDown )
    dom.event.on( window, 'keyup', this.onKeyUp )

  }

  onWindowResize = () => {

    Actions.onWindowResize( window.innerWidth, window.innerHeight )

  }

  onMouseMove = ( e ) => {

    e.preventDefault()
    const _mouse = { x: 0, y: 0, nX: 0, nY: 0 }

    _mouse.x  = e.clientX || _mouse.x
    _mouse.y  = e.clientY || _mouse.y
    _mouse.nX = ( _mouse.x / window.innerWidth ) * 2 - 1
    _mouse.nY = ( _mouse.y / window.innerHeight ) * 2 + 1
    Actions.onMouseMove( _mouse )

  }

  onMouseUp = () => {

    Actions.onMouseUp()

  }

  onMouseDown = () => {

    Actions.onMouseDown()

  }

  onWindowBlur = () => {

    Actions.onWindowBlur()

  }

  onWindowFocus = () => {

    Actions.onWindowFocus()

  }

  onKeyDown = ( e ) => {

    const char = e.which || e.keyCode
    if ( char === 32 && this.keyState !== KEY_STATE.DOWN ) {
      this.keyState = KEY_STATE.DOWN
      Actions.onSpaceDown()
    }

  }

  onKeyUp = ( e ) => {

    const char = e.which || e.keyCode
    if ( char === 32 ) {
      this.keyState = KEY_STATE.UP
      Actions.onSpaceUp()
    }

  }

}

export default InitialState
