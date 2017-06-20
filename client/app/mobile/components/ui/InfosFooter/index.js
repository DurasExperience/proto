import './InfosFooter.styl'
import Store from './../../../../../flux/store/mobile'
import EventsConstants from './../../../../../flux/constants/EventsConstants'

class InfosFooter extends React.Component {

  constructor() {

    super()
    this.state = {
      text: '',
      nextText: ''
    }
    this.nextState = {
      text: '',
      nextText: ''
    }
    this.routeChanged = this.routeChanged.bind( this )
    this.chapterStarted = this.chapterStarted.bind( this )

  }

  componentDidMount() {

    Store.on( EventsConstants.ROUTE_CHANGED, this.routeChanged )
    Store.on( EventsConstants.START_CHAPTER, this.chapterStarted )
    
    this.swapTl = new TimelineMax({
      paused: true,
      onComplete: () => {
        this.setState( this.nextState )
      }
    })
    this.swapTl.fromTo( this.refs.text, 0.5, { y: 0, opacity: 1 }, { y: 10, opacity: 0, ease: Sine.easeInOut }, 0 )
  }

  render() {
    
    return (
      <div className="infos-footer">
        <p className="infos-footer__text" ref="text">{ this.state.text }</p>
      </div>  
    )

  }

  componentDidUpdate() {

    this.swapTl.reverse()

  }

  routeChanged( routes ) {

    switch ( routes.newRoute ) {

      case '/indochine':
        this.nextState.text = 'Reproduisez ce geste pour commencer'
        this.nextState.nextText = 'Rassemblez vos forces'
        break

      case '/troubles':
        this.nextState.text = 'Appuyez longuement pour commencer'
        this.nextState.nextText = 'Observez la vie à travers les yeux d’une artiste tourmentée'
        break

      case '/notoriete':
        this.nextState.text = 'Retournez votre téléphone pour commencer'
        this.nextState.nextText = 'Basculez entre les savoir-faire de Marguerite'
        break

      case '/duras-song':
        this.nextState.text = 'Une exposition proposée par la BPI'
        this.nextState.nextText = ''
        break

      default:
        this.nextState.text = ''
        this.nextState.nextText = ''

    }
    this.swapTl.play( 0 )

  }

  chapterStarted() {

    this.nextState.text = this.state.nextText
    this.swapTl.play( 0 )

  }

}

export default InfosFooter