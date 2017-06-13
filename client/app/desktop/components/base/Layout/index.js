import './layout.styl'
import Page from './../../base/Page'
import Menu from './../../ui/Menu'
import SoundLevel from './../../ui/SoundLevel'
import Store from './../../../../../flux/store/desktop/index'
import Actions from './../../../../../flux/actions'
import Config from './../../../../../config'

class Layout extends Page {

  constructor( props ) {

    super( props )
    this.history = props.history
    this.first = true
    this.onPinch = this.onPinch.bind( this )
    this.state = {
      render: true
    }

  }

  componentDidMount() {

    super.componentDidMount()
    if ( Config.mobileConnect ) Store.socketRoom.on( 'pinch', this.onPinch )
    else dom.event.on( this.refs.parent, 'click', this.onPinch )

    setTimeout( ()=>{

      this.animationText()

    }, 3000)

  }

  setupAnimations(){

    super.setupAnimations()
    this.tlIn.set( this.refs.parent, { visibility: 'visible' } )
    this.tlIn.fromTo( this.refs.parent, 0.5, { opacity: 0 }, { opacity: 1 })
    this.tlOut.fromTo( this.refs.parent, 0.5, { opacity: 1 }, { opacity: 0 })

  }

  render() {

    if ( this.state.render ) {
      return(
        <div className="page" ref="parent">
          <div className="page__gradient"></div>

          <div className="page--layout">
            <SoundLevel/>
            <Menu activeChapter={this} />
            <div className="page--layout__chapter">
              <div  className="page--layout__text">
                <div>
                  <h4 ref="chapter"> {this.props.chapter } </h4>
                  <div className="page--layout__slash" ref="slash"></div>
                </div>
                <h2 ref="title"> {this.props.title } </h2>
                <h3 ref="subtitle"> {this.props.subtitle } </h3>
                <h5 ref="text"> {this.props.text } </h5>
              </div>
            </div>
          </div>

        </div>
      )
    } else return null

  }

  animationText(){

    this.tl = new TimelineMax()
    this.tl.from( this.refs.title, 2, { x: -200, alpha: 0 }, 0 )
    this.tl.from( this.refs.subtitle, 2.7, { x: -200, alpha: 0 }, 0 )
    this.tl.from( this.refs.text, 2, { x: 200, alpha: 0 }, 0 )
    this.tl.from( this.refs.slash, 1, { width: 0, alpha: 0.5 }, 0 )
    this.tl.from( this.refs.chapter, 2.5, { x: 50, y: 25 }, 1 )
    this.tl.from( this.refs.chapter, 2.5, { alpha: 0 }, 1.5 )

  }

  didTransitionOutComplete() {

    super.didTransitionOutComplete()
    this.history.push( this.nextPath )

  }

  onPinch() {

    if ( !this.first ) return
    this.first = false
    TweenMax.to( this.refs.parent, 0.2, { opacity: 0, onComplete: () => {
      setTimeout( Actions.startChapter )
      this.setState({ render: false })
    } } )

  }

}

export default Layout
