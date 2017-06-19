import './SoundLevel.styl'
import Actions from './../../../../../flux/actions/'
import Store from './../../../../../flux/store/desktop/'
import AudioManager from './../../../../../helpers/AudioManager'

class SoundLevel extends React.Component {

  constructor(){

    super()
    this.soundAction = this.soundAction.bind(this)

  }

  componentDidMount(){

    this.bars = document.querySelectorAll('.bar')

    if(Store.sound == true){
      for(let i =0; i<this.bars.length; i++){
        this.bars[i].style.webkitAnimationPlayState = 'running';
      }

    }else{
      for(let i =0; i<this.bars.length; i++){
        this.bars[i].style.webkitAnimationPlayState = 'paused';
      }
    }

  }

  soundAction(){

    Actions.muteAll()
    if(Store.sound == true){

      AudioManager.unmute()
      for(let i =0; i<this.bars.length; i++){
        this.bars[i].style.webkitAnimationPlayState = 'running';
      }

    }else{

      AudioManager.mute()
      for(let i =0; i<this.bars.length; i++){
        this.bars[i].style.webkitAnimationPlayState = 'paused';
      }
    }

  }


  render() {

    return(
      <div className="sound" ref="sound" onClick={ this.soundAction }>
        <div className="bar" ref="bar"></div>
        <div className="bar" ref="bar"></div>
        <div className="bar" ref="bar"></div>
        <div className="bar" ref="bar"></div>
      </div>
    )

  }

}

export default SoundLevel
