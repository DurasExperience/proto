import './ChapterHeader.styl'
import Store from './../../../../../../flux/store/mobile/index'
import EventsConstants from './../../../../../../flux/constants/EventsConstants'

class ChapterHeader extends React.Component {

  constructor() {

    super()
    this.state = {
      index: '',
      title: ''
    }
    this.nextState = {
      index: '',
      title: ''
    }
    this.routeChanged = this.routeChanged.bind( this )
  }

  componentDidMount() {

    Store.on( EventsConstants.ROUTE_CHANGED, this.routeChanged )

    this.swapTl = new TimelineMax({
      paused: true,
      onComplete: () => {
        this.setState( this.nextState )
      }
    })
    this.swapTl.fromTo( this.refs.index, 0.5, { y: 0, opacity: 1 }, { y: 10, opacity: 0, ease: Sine.easeInOut }, 0 )
    this.swapTl.fromTo( this.refs.title, 0.5, { y: 0, opacity: 1 }, { y: 10, opacity: 0, ease: Sine.easeInOut }, 0.2 )

  }

  render() {
    
    return (
      <div className="chapter-header">
        <strong className="chapter-header__index" ref="index">{ this.state.index }</strong>
        <h3 className="chapter-header__title" ref="title">{ this.state.title }</h3>
      </div>  
    )

  }

  componentDidUpdate() {

    this.swapTl.reverse()

  }

  routeChanged( routes ) {

    switch ( routes.newRoute ) {

      case '/indochine':
        this.nextState.index = '01'
        this.nextState.title = 'Indochine'
        break

      case '/troubles':
        this.nextState.index = '02'
        this.nextState.title = 'Troubles'
        break

      case '/notoriete':
        this.nextState.index = '03'
        this.nextState.title = 'Notoriété'
        break

      case '/duras-song':
        this.nextState.index = '04'
        this.nextState.title = 'Duras Song'
        break

      default:
        this.nextState.index = ''
        this.nextState.title = ''

    }
    this.swapTl.play( 0 )

  }

}

export default ChapterHeader