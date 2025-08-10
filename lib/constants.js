export const PLAYER_STATES = {
  PLAYING: 'playing',
  PAUSED: 'paused',
  STOPPED: 'stopped',
  LOADING: 'loading',
  ERROR: 'error'
};

export const REPEAT_MODES = {
  OFF: 'off',
  ONE: 'one',
  ALL: 'all'
};

export const VISUALIZER_TYPES = {
  BARS: 'bars',
  WAVE: 'wave',
  CIRCLE: 'circle',
  SPECTRUM: 'spectrum'
};

export const AUDIO_FORMATS = [
  'mp3',
  'wav',
  'ogg',
  'm4a',
  'aac',
  'flac'
];

export const SAMPLE_TRACKS = [
  {
    id: 1,
    title: 'Midnight Dreams',
    artist: 'Luna Eclipse',
    album: 'Nocturnal Vibes',
    duration: 245,
    url: '/audio/midnight-dreams.mp3',
    cover: '/images/covers/midnight-dreams.jpg',
    genre: 'Electronic',
    year: 2023,
    color: '#6366f1'
  },
  {
    id: 2,
    title: 'Ocean Waves',
    artist: 'Coastal Sounds',
    album: 'Nature\'s Symphony',
    duration: 198,
    url: '/audio/ocean-waves.mp3',
    cover: '/images/covers/ocean-waves.jpg',
    genre: 'Ambient',
    year: 2022,
    color: '#0ea5e9'
  },
  {
    id: 3,
    title: 'Urban Pulse',
    artist: 'City Lights',
    album: 'Metropolitan',
    duration: 312,
    url: '/audio/urban-pulse.mp3',
    cover: '/images/covers/urban-pulse.jpg',
    genre: 'Hip Hop',
    year: 2023,
    color: '#f59e0b'
  },
  {
    id: 4,
    title: 'Forest Whispers',
    artist: 'Nature\'s Voice',
    album: 'Woodland Tales',
    duration: 267,
    url: '/audio/forest-whispers.mp3',
    cover: '/images/covers/forest-whispers.jpg',
    genre: 'Ambient',
    year: 2021,
    color: '#10b981'
  },
  {
    id: 5,
    title: 'Neon Nights',
    artist: 'Synthwave Collective',
    album: 'Retro Future',
    duration: 289,
    url: '/audio/neon-nights.mp3',
    cover: '/images/covers/neon-nights.jpg',
    genre: 'Synthwave',
    year: 2023,
    color: '#ec4899'
  },
  {
    id: 6,
    title: 'Mountain Echo',
    artist: 'Alpine Sounds',
    album: 'High Peaks',
    duration: 234,
    url: '/audio/mountain-echo.mp3',
    cover: '/images/covers/mountain-echo.jpg',
    genre: 'Folk',
    year: 2022,
    color: '#8b5cf6'
  },
  {
    id: 7,
    title: 'Digital Rain',
    artist: 'Cyber Dreams',
    album: 'Matrix',
    duration: 301,
    url: '/audio/digital-rain.mp3',
    cover: '/images/covers/digital-rain.jpg',
    genre: 'Electronic',
    year: 2023,
    color: '#06b6d4'
  },
  {
    id: 8,
    title: 'Sunset Boulevard',
    artist: 'Golden Hour',
    album: 'Evening Glow',
    duration: 276,
    url: '/audio/sunset-boulevard.mp3',
    cover: '/images/covers/sunset-boulevard.jpg',
    genre: 'Jazz',
    year: 2022,
    color: '#f97316'
  }
];

export const PLAYLISTS = [
  {
    id: 1,
    name: 'Chill Vibes',
    description: 'Relaxing tracks for unwinding',
    tracks: [2, 4, 6],
    cover: '/images/playlists/chill-vibes.jpg',
    color: '#10b981'
  },
  {
    id: 2,
    name: 'Electronic Mix',
    description: 'Best electronic beats',
    tracks: [1, 5, 7],
    cover: '/images/playlists/electronic-mix.jpg',
    color: '#6366f1'
  },
  {
    id: 3,
    name: 'Urban Sounds',
    description: 'City life soundtrack',
    tracks: [3, 8],
    cover: '/images/playlists/urban-sounds.jpg',
    color: '#f59e0b'
  }
];

export const EQUALIZER_PRESETS = {
  flat: {
    name: 'Flat',
    gains: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  rock: {
    name: 'Rock',
    gains: [4, 3, -1, -2, 1, 2, 4, 5, 5, 5]
  },
  pop: {
    name: 'Pop',
    gains: [-1, 2, 4, 4, 1, -1, -1, -1, 2, 4]
  },
  jazz: {
    name: 'Jazz',
    gains: [3, 2, 1, 2, -1, -1, 0, 1, 2, 3]
  },
  classical: {
    name: 'Classical',
    gains: [4, 3, 2, 1, -1, -1, 0, 1, 2, 3]
  },
  electronic: {
    name: 'Electronic',
    gains: [3, 2, 0, -1, -1, 1, 2, 3, 4, 5]
  },
  bass: {
    name: 'Bass Boost',
    gains: [6, 5, 4, 2, 1, 0, 0, 0, 0, 0]
  },
  treble: {
    name: 'Treble Boost',
    gains: [0, 0, 0, 0, 0, 1, 2, 3, 4, 5]
  }
};

export const VISUALIZER_SETTINGS = {
  bars: {
    count: 64,
    minHeight: 2,
    maxHeight: 100,
    gap: 2,
    smoothing: 0.8
  },
  wave: {
    points: 128,
    amplitude: 50,
    frequency: 1,
    smoothing: 0.85
  },
  circle: {
    radius: 80,
    bars: 32,
    innerRadius: 20,
    smoothing: 0.8
  },
  spectrum: {
    resolution: 256,
    smoothing: 0.9,
    sensitivity: 1.2
  }
};

export const THEME_COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a'
  },
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a'
  }
};

export const KEYBOARD_SHORTCUTS = {
  PLAY_PAUSE: 'Space',
  NEXT_TRACK: 'ArrowRight',
  PREV_TRACK: 'ArrowLeft',
  VOLUME_UP: 'ArrowUp',
  VOLUME_DOWN: 'ArrowDown',
  MUTE: 'KeyM',
  SHUFFLE: 'KeyS',
  REPEAT: 'KeyR',
  FULLSCREEN: 'KeyF',
  SEARCH: 'KeyK'
};

export const STORAGE_KEYS = {
  CURRENT_TRACK: 'mp3_player_current_track',
  PLAYLIST: 'mp3_player_playlist',
  VOLUME: 'mp3_player_volume',
  REPEAT_MODE: 'mp3_player_repeat_mode',
  SHUFFLE: 'mp3_player_shuffle',
  EQUALIZER: 'mp3_player_equalizer',
  THEME: 'mp3_player_theme',
  VISUALIZER_TYPE: 'mp3_player_visualizer_type'
};

export const API_ENDPOINTS = {
  TRACKS: '/api/tracks',
  PLAYLISTS: '/api/playlists',
  SEARCH: '/api/search',
  UPLOAD: '/api/upload'
};

export const AUDIO_SETTINGS = {
  DEFAULT_VOLUME: 0.7,
  FADE_DURATION: 300,
  CROSSFADE_DURATION: 500,
  BUFFER_SIZE: 2048,
  SAMPLE_RATE: 44100,
  FFT_SIZE: 2048
};

export const UI_CONSTANTS = {
  MINI_PLAYER_HEIGHT: 80,
  FULL_PLAYER_HEIGHT: '100vh',
  SIDEBAR_WIDTH: 280,
  MOBILE_BREAKPOINT: 768,
  ANIMATION_DURATION: 200,
  DEBOUNCE_DELAY: 300
};

export const ERROR_MESSAGES = {
  AUDIO_LOAD_ERROR: 'Failed to load audio file',
  NETWORK_ERROR: 'Network connection error',
  UNSUPPORTED_FORMAT: 'Audio format not supported',
  PLAYBACK_ERROR: 'Playback error occurred',
  PERMISSION_DENIED: 'Audio permission denied'
};

export const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const getTrackById = (id) => {
  return SAMPLE_TRACKS.find(track => track.id === parseInt(id));
};

export const getPlaylistById = (id) => {
  return PLAYLISTS.find(playlist => playlist.id === parseInt(id));
};

export const searchTracks = (query) => {
  if (!query) return SAMPLE_TRACKS;
  const lowercaseQuery = query.toLowerCase();
  return SAMPLE_TRACKS.filter(track =>
    track.title.toLowerCase().includes(lowercaseQuery) ||
    track.artist.toLowerCase().includes(lowercaseQuery) ||
    track.album.toLowerCase().includes(lowercaseQuery) ||
    track.genre.toLowerCase().includes(lowercaseQuery)
  );
};