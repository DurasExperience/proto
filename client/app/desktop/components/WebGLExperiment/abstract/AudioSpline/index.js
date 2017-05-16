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
    AudioManager.fade( this.track, 0, 1, 500, this.voiceId )

  }

  reverse( d ) {

    super.reverse( d )

    AudioManager.fade( this.track, 1, 0, 400, this.voiceId )
    AudioManager.rate( this.track, 0.75, this.voiceId )
    setTimeout( this.restartSound, d * 500 )

  }

  fadeOutSound() {

    AudioManager.fade( this.track, 1, 0, 200, this.voiceId )

  }

  restartSound() {

    const newTime = this.voice.seek() - this.d
    AudioManager.rate( this.track, 1, this.voiceId )
    AudioManager.setTime( this.track, newTime, this.voiceId )
    AudioManager.fade( this.track, 0, 1, 300, this.voiceId )

  }
  
}

export default AudioSpline
