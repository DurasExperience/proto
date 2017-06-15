import './Chapter.styl'

class Chapter extends React.Component {

  componentDidMount() {

    this.animationText()

  }

  animationText(){

    this.tl = new TimelineMax()
    this.tl.from( this.refs.title, 1, { x: -200, opacity: 0 }, 0 )
    this.tl.from( this.refs.subtitle, 1, { x: -200, opacity: 0 }, 0.2 )
    this.tl.from( this.refs.text, 1, { x: 200, opacity: 0 }, 0 )
    this.tl.from( this.refs.slash, 0.5, { width: 0, opacity: 0.9 }, 0.5 )
    this.tl.from( this.refs.chapter, 1, { x: 50, y: 25 }, 1 )
    this.tl.from( this.refs.chapter, 1, { opacity: 0 }, 1.5 )
    this.tl.timeScale( 0.75 )

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
