export default {
  postProcessing: {
    boxBlurPass: {
      x: 0.3,
      y: 0.3
    },
    vignettePass: {
      boost: 0.7,
      reduction: 1.1
    },
    zoomBlurPass: {
      strength: 0.0025
    },
    multiPassBloomPass: {
      blurAmount: 2,
      applyZoomBlur: false,
      zoomBlurStrength: 0.2,
      useTexture: false
    },
    godrayPass: {
      fX: 0.5,
      fY: 1,
      fExposure: 0.6,
      fDecay: 0.9,
      fDensity: 0,
      fWeight: 0
    },
    tiltShiftPass: {
      bluramount: 1.2,
      center: 1,
      stepSize: 0.005
    }
  }
}