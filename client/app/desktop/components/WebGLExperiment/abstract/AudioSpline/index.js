import { CatmullRomCurve3, Geometry } from 'three'
import AudioManager from './../../../../../../helpers/AudioManager'
import Spline from './../Spline/'


class AudioSpline extends Spline {

  constructor( scene, controlsContainer, track ) {

    super()

    this.scene = scene
    this.controlsContainer = controlsContainer
    this.track = track
    this.voice = AudioManager.get( this.track )
    this.duration = Math.ceil( this.voice.duration() )

  }

  play() {

    this.voiceId = this.voice.play()
    this.voice.fade( 0, 1, 500, this.voiceId )

  }

  reverse( d ) {

    super.reverse( d )

    this.voice.fade( 1, 0, 500, this.voiceId )
    setTimeout( this.restartSound, d * 500 )

  }

  fadeOutSound() {

    this.voice.fade( this.track, 1, 0, 200, this.voiceId )

  }

  restartSound() {

    const newTime = this.voice.seek() - this.d
    this.voice.setTime( newTime, this.voiceId )
    this.voice.fade( 0, 1, 300, this.voiceId )

  }

}

export default AudioSpline
