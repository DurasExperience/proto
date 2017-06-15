import './Chapter.styl'
import SVGComponent from './../SVGComponent'

class Chapter extends React.Component {

  componentDidMount() {

    this.animationText()

  }

  animationText(){

    this.tl = new TimelineMax({ delay: 1 })
    this.tl.from( this.refs.title, 1, { x: -200, opacity: 0 }, 0 )
    this.tl.from( this.refs.subtitle, 1, { x: -200, opacity: 0 }, 0.2 )
    this.tl.from( this.refs.text, 1, { x: 200, opacity: 0 }, 0 )
    this.tl.from( this.refs.slash, 0.5, { width: 0, opacity: 0.9 }, 0.5 )
    this.tl.from( this.refs.chapter, 1, { x: 50, y: 25 }, 1 )
    this.tl.from( this.refs.chapter, 1, { opacity: 0 }, 1.5 )
    if ( this.props.chapterText.chapter === '04' ) {
      const icons = Array.prototype.slice.call( this.refs.icons.children, 0 )
      this.tl.from( this.refs.link, 1, { x: -50, opacity: 0 }, 1.3 )
      this.tl.staggerFrom( icons, 0.3, { y: 10, opacity: 0 }, 0.2, 1.5 )
    }
    this.tl.timeScale( 0.75 )

  }

  render() {

    const social = this.props.chapterText.chapter === '04' ? this.getSocialLinks() : null

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
          { social }
        </div>
      </div>
    )

  }

  getSocialLinks() {

    return (
      <div className="page--layout__social" ref="social">
        <a href="https://www.centrepompidou.fr/cpv/resource/cLrAob7/rdLk9x6" target="_blank" ref="link">Découvrir l'exposition</a>
        <div className="page--layout__list" ref="icons">
          <div className="page--layout__icon">
            <SVGComponent width="19px" height="16px" viewBox="0 0 19 16">
              <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="14-Chapitre-4-:-BPI" transform="translate(-722.000000, -817.000000)" fill="#FFFFFF">
                  <g id="Group" transform="translate(722.000000, 815.000000)">
                      <path d="M18.8449848,3.85200621 C18.1518254,4.16660107 17.4066408,4.37880604 16.6243499,4.4737707 C17.4227074,3.98526937 18.0355337,3.21148328 18.3243502,2.28880198 C17.5772528,2.74134961 16.750205,3.0704041 15.8692193,3.24743698 C15.1642012,2.4799037 14.159273,2 13.0472342,2 C10.9122879,2 9.18091946,3.76876559 9.18091946,5.94982629 C9.18091946,6.25934073 9.21534791,6.56064835 9.2811445,6.84984113 C6.06782269,6.68531388 3.21867735,5.11312123 1.31210641,2.72298196 C0.979298076,3.30644794 0.788411458,3.98448777 0.788411458,4.70864213 C0.788411458,6.07918144 1.47124234,7.28792912 2.5083037,7.99645143 C1.87482026,7.97573898 1.27844303,7.7983153 0.757425855,7.5020881 C0.757043317,7.51850174 0.757043317,7.53530619 0.757043317,7.55211063 C0.757043317,9.46547261 2.08980679,11.0618949 3.85866394,11.4249491 C3.53427145,11.5152242 3.19266474,11.5636835 2.83996442,11.5636835 C2.59054944,11.5636835 2.34840269,11.539063 2.11237655,11.4925577 C2.60432082,13.0616239 4.03233633,14.2039354 5.72392074,14.2355903 C4.40072073,15.295052 2.73361877,15.9265865 0.921917329,15.9265865 C0.610148606,15.9265865 0.302587804,15.9078281 0,15.8714836 C1.71109386,16.992301 3.74313737,17.6461112 5.92666605,17.6461112 C13.0384358,17.6461112 16.9269377,11.6273841 16.9269377,6.40784513 C16.9269377,6.23706507 16.9234949,6.06628501 16.9162266,5.89667735 C17.6713573,5.34017664 18.3270279,4.64415996 18.8449848,3.85200621" id="Fill-1"></path>
                  </g>
                </g>
              </g>
            </SVGComponent>
          </div>
          <div className="page--layout__icon">
            <SVGComponent width="9px" height="19px" viewBox="0 0 9 19">
                <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="14-Chapitre-4-:-BPI" transform="translate(-776.000000, -815.000000)" fill="#FFFFFF">
                        <g id="Group" transform="translate(722.000000, 815.000000)">
                            <path d="M62.7494572,6.06556299 L59.7699566,6.06556299 L59.7699566,4.12138778 C59.7699566,3.39164351 60.2560159,3.2210338 60.5982453,3.2210338 L62.7011241,3.2210338 L62.7011241,0.0116324803 L59.805037,0 C56.5901075,0 55.858485,2.39396445 55.858485,3.92596211 L55.858485,6.06556299 L54,6.06556299 L54,9.37267714 L55.858485,9.37267714 L55.858485,18.7317831 L59.7699566,18.7317831 L59.7699566,9.37267714 L62.4080074,9.37267714 L62.7494572,6.06556299 Z" id="Page-1"></path>
                        </g>
                    </g>
                </g>
            </SVGComponent>
          </div>
          <div className="page--layout__icon">
            
            <SVGComponent width="22px" height="22px" viewBox="0 0 22 22">
              <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="14-Chapitre-4-:-BPI" transform="translate(-553.000000, -848.000000)">
                  <g id="Group" transform="translate(554.000000, 815.000000)">
                    <g id="insta" transform="translate(0.000000, 34.000000)">
                      <circle id="Oval" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" cx="10" cy="10" r="4.6195122"></circle>
                      <ellipse id="Oval" fill="#FFFFFF" cx="16.4758537" cy="4.92219516" rx="1.21000004" ry="1.21000004"></ellipse>
                      <rect id="Rectangle-path" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" x="0" y="0" width="20" height="20" rx="5"></rect>
                    </g>
                </g>
                </g>
              </g>
            </SVGComponent>
          </div>
        </div>
      </div>
    )

  }

}

export default Chapter
