import './SynchroSuccess.styl'
import Actions from './../../../../../../flux/actions/index'

class SynchroSuccess extends React.Component {

  constructor() {

    super()
    this.start = this.start.bind( this )

  }

  componentDidMount() {

    TweenMax.set( this.refs.phone, { transformOrigin: '50% 50%' } )
    TweenMax.set( this.refs.line, { transformOrigin: '50% 50%' } )

    this.animTl = new TimelineMax({ paused: true, repeat: -1, yoyo: true })
    this.animTl.fromTo( this.refs.phone, 1, { rotation: -5 }, { rotation: 5 }, 0 )
    this.animTl.fromTo( this.refs.line, 1, { rotation: -5 }, { rotation: 5 }, 0 )

    this.tlIn = new TimelineMax({ paused: true })
    this.tlIn.to( this.refs.animation, 0.5, { opacity: 1, ease: Sine.easeOut }, 0 )
    this.tlIn.add( () => { this.animTl.play() }, 0.1 )
    this.tlIn.to( this.refs.title, 0.5, { opacity: 1, ease: Sine.easeOut }, 0.3 )
    this.tlIn.to( this.refs.subtitle, 0.5, { opacity: 1, ease: Sine.easeOut }, 0.6 )
    this.tlIn.add( () => { Actions.changePage( '/indochine' ) }, 3 )

  }

  start() {

    this.tlIn.play()

  }

  render() {
    return (
      <div className="synchronisation-success">
        <svg viewBox="0 0 241 226" ref="animation" className="animation">
          <g fill="none" fillRule="evenodd">
            <path stroke="#FFF" strokeLinecap="round" strokeLinejoin="round" d="M28.0321337 120.645963H200.742494V9.95445135H28.0321337z"/>
            <path d="M207.841385 129.082816V13.375089c0-7.10855484-5.637689-12.86991302-12.593656-12.86991302H33.5247855c-6.9559675 0-12.5936564 5.76135818-12.5936564 12.86991302V129.082816H207.841385z" stroke="#FFF" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M.49305404 129.082816c1.24430714 3.720314 4.65492397 6.412008 8.7154337 6.412008H220.886004c4.060509 0 7.471126-2.691694 8.715433-6.412008H.49305404z" stroke="#FFF" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M115.707178 5.39855072c0 .74514286-.591773 1.34989648-1.320921 1.34989648s-1.32092-.60475362-1.32092-1.34989648c0-.74514285.591772-1.34989648 1.32092-1.34989648.729148 0 1.320921.60475363 1.320921 1.34989648" fill="#FFF"/>
            <g stroke="#FFF" ref="phone">
              <path d="M60.820184 209.5394233v-48.74712333c0-2.88 2.332164-5.2150685 5.209403-5.2150685h98.48694052c2.8764179 0 5.209403 2.3350685 5.209403 5.2150685v48.74712333c0 2.8808219-2.3329851 5.2158904-5.209403 5.2158904H66.029587c-2.877239 0-5.209403-2.3350685-5.209403-5.2158904zM75.7331469 155.5769849v59.1780822M158.6435947 155.5769849v59.1780822"/>
              <path d="M68.208244 189.0019164c-2.116269 0-3.831119-1.7178082-3.831119-3.8358904s1.71485-3.8350685 3.831119-3.8350685c2.1154477 0 3.8302984 1.7169863 3.8302984 3.8350685s-1.7148507 3.8358904-3.8302984 3.8358904z"/>
            </g>
            <path d="M44.9712789 71l140.6442781 1" stroke="#FFF" ref="line"/>
          </g>
        </svg>
        <h3 ref="title">Synchronisation réussie</h3>
        <p ref="subtitle">Votre smartphone contrôle désormais votre ordinateur</p>
      </div>
    )
  }

 }

export default SynchroSuccess