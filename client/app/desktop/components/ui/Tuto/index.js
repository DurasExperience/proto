import './Tuto.styl'
import bodymovin from 'bodymovin'
import Store from './../../../../../flux/store/desktop/'
class Tuto extends React.Component {

  componentDidMount(){

    this.setBodymovin()

  }

  setBodymovin(){

    let data = JSON.stringify(Store.getResource( this.props.tutoAnim ).file)

    let element = this.refs.animation
    bodymovin.loadAnimation( {
      container: element,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: JSON.parse(data)
    } )

  }

  render() {


    return(
      <div className="tuto">
        <div className="animation" ref="animation"> </div>
        <div className="text"> { this.props.tutoText } </div>
      </div>
    )

  }

}

export default Tuto
