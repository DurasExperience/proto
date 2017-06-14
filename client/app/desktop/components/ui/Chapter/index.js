import './Chapter.styl'

class Chapter extends React.Component {

  componentDidMount() {

    setTimeout( ()=>{

      this.animationText()

    }, 2000)

  }

  animationText(){

    this.tl = new TimelineMax()
    this.tl.from( this.refs.title, 1.5, { x: -200, alpha: 0 }, 0 )
    this.tl.from( this.refs.subtitle, 2.2, { x: -200, alpha: 0 }, 0 )
    this.tl.from( this.refs.text, 1.5, { x: 200, alpha: 0 }, 0 )
    this.tl.from( this.refs.slash, 0.5, { width: 0, alpha: 0.9 }, 0.5 )
    this.tl.from( this.refs.chapter, 2, { x: 50, y: 25 }, 1.2 )
    this.tl.from( this.refs.chapter, 2, { alpha: 0 }, 2 )

  }

  render() {

    return(
      <div className="page--layout__chapter">
        <div  className="page--layout__text">
          <div>
            <h4 ref="chapter"> {this.props.chapterText.chapter } </h4>
            <div className="page--layout__slash" ref="slash"></div>
          </div>
          <h2 ref="title"> {this.props.chapterText.title } </h2>
          <h3 ref="subtitle"> {this.props.chapterText.subtitle } </h3>
          <h5 ref="text"> {this.props.chapterText.text } </h5>
        </div>
      </div>
    )

  }

}

export default Chapter
