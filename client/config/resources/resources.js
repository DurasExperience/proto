export default [
  ///////// Chapitre 1.1
  {
    type: 'audio',
    id: '01_01_voice_surface',
    url: '/assets/sounds/01/01/VOIX-SURFACE.mp3',
    options: {
      loop: false,
      volume: 0
    }
  },
  {
    type: 'audio',
    id: '01_01_voice_underwater',
    url: '/assets/sounds/01/01/VOIX-DANS-LEAU.mp3',
    options: {
      loop: false,
      volume: 0
    }
  },
  {
    type: 'audio',
    id: '01_01_musique_surface',
    url: '/assets/sounds/01/01/MUSIQUE-SURFACE.mp3',
    options: {
      loop: true,
      volume: 0
    }
  },
  {
    type: 'audio',
    id: '01_01_musique_underwater',
    url: '/assets/sounds/01/01/MUSIQUE-DANS-LEAU.mp3',
    options: {
      loop: true,
      volume: 0
    }
  },
  {
    type: 'model',
    id: '01_mountains',
    url: '/assets/models/01/01/mountains.awd'
  },
  ///////// Chapitre 1.2
  {
    type: 'model',
    id: '01_hand_man',
    url: '/assets/models/01/02/hand_man.awd'
  },
  {
    type: 'model',
    id: '01_hand_woman',
    url: '/assets/models/01/02/hand_woman.awd'
  },
  {
    type: 'audio',
    id: '01_02_voice',
    url: '/assets/sounds/01/02/VOIX-PARTIE2-SURFACE.mp3',
    options: {
      loop: false,
      volume: 1
    }
  },
  {
    type: 'audio',
    id: 'heartbeat',
    url: '/assets/sounds/01/02/HEART-BEAT.mp3',
    options: {
      loop: true,
      volume: 0,
      buffer: true
    }
  },
  {
    type: 'model',
    id: 'spline-hand-man',
    url: '/assets/models/01/02/spline-hand-man.awd'
  },
  {
    type: 'model',
    id: 'spline-hand-woman',
    url: '/assets/models/01/02/spline-hand-woman.awd'
  },
  ///////// Chapitre 2.0
  {
    type: 'model',
    id: '02_01_building',
    url: '/assets/models/02/01/building.awd'
  },
  ///////// Chapitre 2.1
  {
    type: 'audio',
    id: '02_01_voice',
    url: '/assets/sounds/02/01/voice.mp3',
    options: {
      loop: false,
      volume: 0
    }
  },
  {
    type: 'audio',
    id: '02_01_ambient',
    url: '/assets/sounds/02/01/ambient.mp3',
    options: {
      loop: false,
      volume: 0
    }
  },
  {
    type: 'audio',
    id: '02_01_drunk_ambient',
    url: '/assets/sounds/02/01/drunk_ambient.mp3',
    options: {
      loop: false,
      volume: 0
    }
  },
  ///////// Chapitre 3.0
  {
    type: 'audio',
    id: '03_musique',
    url: '/assets/sounds/03/MUSIQUE.mp3',
    options: {
      loop: false,
      volume: 0
    }
  },
  {
    type: 'audio',
    id: '03_voice',
    url: '/assets/sounds/03/VOIX.mp3',
    options: {
      loop: false,
      volume: 0
    }
  },
  ///////// Phone
  {
    type: 'json',
    id: 'phone',
    url: '/assets/bodymovin/mobile/data.json'
  }
]
