import DeviceConstants from './../constants/DeviceConstants'
import EventsConstants from './../constants/EventsConstants'
import Dispatcher from './../dispatcher'

const Actions = {

  onWindowResize( windowW, windowH ) {

    Dispatcher.dispatch({
      type: EventsConstants.WINDOW_RESIZE,
      item: { windowW: windowW, windowH: windowH }
    })

  },
  onMouseMove( mouse ) {

    Dispatcher.dispatch({
      type: EventsConstants.MOUSE_MOVE,
      item: mouse
    })

  },
  onMouseUp() {

    Dispatcher.dispatch({
      type: EventsConstants.MOUSE_UP,
      item: null
    })

  },
  onMouseDown() {

    Dispatcher.dispatch({
      type: EventsConstants.MOUSE_DOWN,
      item: null
    })

  },
  onWindowBlur() {

    Dispatcher.dispatch({
      type: EventsConstants.WINDOW_ON_BLUR,
      item: null
    })

  },
  onWindowFocus() {

    Dispatcher.dispatch({
      type: EventsConstants.WINDOW_ON_FOCUS,
      item: null
    })

  },
  onSpacePress() {
    Dispatcher.dispatch({
      type: EventsConstants.SPACE_PRESS,
      item: null
    })

  },
  onResourceProgress( progress ) {

    Dispatcher.dispatch({
      type: EventsConstants.RESOURCES_PROGRESS,
      item: progress
    })

  },
  onResourceReady( resources ) {

    Dispatcher.dispatch({
      type: EventsConstants.RESOURCES_READY,
      item: resources
    })

  },
  startApp() {

    Dispatcher.dispatch({
      type: EventsConstants.APP_START,
      item: null
    })

  },
  routeChanged( oldRoute, newRoute ) {

    Dispatcher.dispatch({
      type: EventsConstants.ROUTE_CHANGED,
      item: { oldRoute: oldRoute, newRoute: newRoute }
    })

  },
  changePage( newPath ) {

    Dispatcher.dispatch({
      type: EventsConstants.CHANGE_PAGE,
      item: newPath
    })

  },
  changeSubpage( newPath ) {

    Dispatcher.dispatch({
      type: EventsConstants.CHANGE_SUBPAGE,
      item: newPath
    })

  },
  transitionOut( nextPath ) {

    Dispatcher.dispatch({
      type: EventsConstants.TRANSITION_OUT,
      item: nextPath
    })

  },
  onTransitionOutComplete() {

    Dispatcher.dispatch({
      type: EventsConstants.TRANSITION_OUT_COMPLETE,
      item: undefined
    })

  },
  onMobilePinch() {

    Dispatcher.dispatch({
      type: EventsConstants.MOBILE_ON_PINCH,
      item: undefined
    })

  },
  startChapter() {

    Dispatcher.dispatch({
      type: EventsConstants.START_CHAPTER,
      item: undefined
    })

  }

}

export default Actions
