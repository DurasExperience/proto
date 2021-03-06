import { Howl, Howler } from 'howler'
import Store from './../flux/store/desktop'
import EventsConstants from './../flux/constants/EventsConstants'

class AudioManager {

  constructor() {

    this.blockMute = false

    this.bind()
    this.addListeners()
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  }

  bind() {

    [ 'onWindowBlur', 'onWindowFocus' ]
        .forEach( ( fn ) => this[ fn ] = this[ fn ].bind( this ) )

  }

  addListeners() {

    Store.on( EventsConstants.WINDOW_ON_FOCUS, this.onWindowFocus )
    Store.on( EventsConstants.WINDOW_ON_BLUR, this.onWindowBlur )

  }

  mute() {

    Howler.mute( true )

  }

  unmute() {

    Howler.mute( false )
    this.blockMute = false

  }

  lockMute() {

    this.blockMute = true
    this.mute()

  }

  onWindowFocus() {

    if( this.blockMute ) return
    this.unmute()

  }

  onWindowBlur() {

    this.mute()

  }

  getFrequency( sound ){
    //
    // let audioSource = this.audioCtx.createBufferSource()
    // this.analyser = this.audioCtx.createAnalyser()
    //
    // this.sound = sound._sounds[0]._node
    //
    // let buffer = this.sound.bufferSource.buffer
    // audioSource.buffer = buffer
    //
    // audioSource.connect( this.analyser )
    //
    // let frequencyData = new Uint8Array( this.analyser.frequencyBinCount )
    // this.analyser.getByteFrequencyData( frequencyData )
    //
    // console.log( frequencyData );
    // console.log("buf ", buffer, "audS ", this.analyser, "frqs ",frequencyData );

  }

  /**
   * Load audio file
   * @param {string} url
   * @param {function} onLoad
   * @param {function} onSuccess
   * @param {function} onReject
   * @param {string} id
   * @param {array} options
   */
  load( url, onLoad, onSuccess, onReject, id, options = { volume: 0, loop: false } ) {

    const audio = new Howl({
      src: url,
      volume: options.volume,
      loop: options.loop,
      buffer: options.buffer,
      onload: () => {

        onLoad( audio )

      }
    })

  }

  /**
   * Get sound by id
   * @param {string} id
   */
  get( id ) {

    const sound = Store.getResource( id )
    if( typeof sound === 'undefined' ) return false
    return sound

  }

  /**
   * Play sound by id
   * @param {string} id
   */
  play( id ) {

    const sound = Store.getResource( id )

    if( typeof sound === 'undefined' ) return
    return sound.play()

  }

  stop( id ) {

    const sound = Store.getResource( id )

    if( typeof sound === 'undefined' ) return
    return sound.stop()

  }

  /**
   * Fade sound by id
   * @param {string} id
   * @param {float} start
   * @param {float} end
   * @param {float} duration
   * @param {int} soundId
   */
  fade( id, start, end, duration, soundId ) {

    const sound = Store.getResource( id )
    sound.fade( start, end, duration, soundId )

  }

  /**
   * Rate sound at id
   * @param {string} id
   * @param {float} speed
   * @param {int} soundId
   */
  rate( id, speed, soundId ) {

    const sound = Store.getResource( id )
    sound.rate( speed, soundId )

  }

  /**
   * Rate sound at id
   * @param {string} id
   * @param {float} position
   * @param {int} soundId
   */
  setTime( id, position, soundId ) {

    const sound = Store.getResource( id )
    sound.seek( position, soundId )

  }

}

export default new AudioManager()
