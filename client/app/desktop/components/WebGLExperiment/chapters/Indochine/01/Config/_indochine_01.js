export default {
  postProcessing: {
    boxBlurPass: {
      x: 0.3,
      y: 0.3
    },
    vignettePass: {
      boost: 1,
      reduction: 0
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
      fY: 0.7,
      fExposure: 0,
      fDecay: 0,
      fDensity: 0,
      fWeight: 0
    },
    tiltShiftPass: {
      bluramount: 1.2,
      center: 1,
      stepSize: 0.005
    }
  },
  tuna: {
    fq: {
      frequency: 1500, //20 to 22050
      Q: 1, //0.001 to 100
      gain: 0, //-40 to 40 (in decibels)
      filterType: 'lowpass', //lowpass, highpass, bandpass, lowshelf, highshelf, peaking, notch, allpass
      bypass: 0
    }
  }
}
