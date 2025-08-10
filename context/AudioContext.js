'use client';

import React, { createContext, useContext, useReducer, useRef, useEffect } from 'react';

const AudioContext = createContext();

const initialState = {
  currentTrack: null,
  tracks: [],
  isPlaying: false,
  isPaused: false,
  isLoading: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  isShuffled: false,
  repeatMode: 'none',
  playbackRate: 1,
  isFullscreen: false,
  playlist: [],
  currentIndex: -1,
  error: null,
  audioData: null,
  visualizerData: new Uint8Array(256),
  isVisualizerActive: false
};

const audioReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TRACKS':
      return {
        ...state,
        tracks: action.payload,
        playlist: action.payload
      };
    
    case 'SET_CURRENT_TRACK':
      return {
        ...state,
        currentTrack: action.payload.track,
        currentIndex: action.payload.index,
        error: null
      };
    
    case 'PLAY':
      return {
        ...state,
        isPlaying: true,
        isPaused: false,
        error: null
      };
    
    case 'PAUSE':
      return {
        ...state,
        isPlaying: false,
        isPaused: true
      };
    
    case 'STOP':
      return {
        ...state,
        isPlaying: false,
        isPaused: false,
        currentTime: 0
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    
    case 'SET_TIME':
      return {
        ...state,
        currentTime: action.payload
      };
    
    case 'SET_DURATION':
      return {
        ...state,
        duration: action.payload
      };
    
    case 'SET_VOLUME':
      return {
        ...state,
        volume: action.payload,
        isMuted: action.payload === 0
      };
    
    case 'TOGGLE_MUTE':
      return {
        ...state,
        isMuted: !state.isMuted
      };
    
    case 'SET_SHUFFLE':
      return {
        ...state,
        isShuffled: action.payload
      };
    
    case 'SET_REPEAT':
      return {
        ...state,
        repeatMode: action.payload
      };
    
    case 'SET_PLAYBACK_RATE':
      return {
        ...state,
        playbackRate: action.payload
      };
    
    case 'TOGGLE_FULLSCREEN':
      return {
        ...state,
        isFullscreen: !state.isFullscreen
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    
    case 'SET_VISUALIZER_DATA':
      return {
        ...state,
        visualizerData: action.payload
      };
    
    case 'TOGGLE_VISUALIZER':
      return {
        ...state,
        isVisualizerActive: !state.isVisualizerActive
      };
    
    case 'NEXT_TRACK':
      const nextIndex = state.isShuffled 
        ? Math.floor(Math.random() * state.playlist.length)
        : (state.currentIndex + 1) % state.playlist.length;
      
      return {
        ...state,
        currentIndex: nextIndex,
        currentTrack: state.playlist[nextIndex] || null
      };
    
    case 'PREVIOUS_TRACK':
      const prevIndex = state.isShuffled
        ? Math.floor(Math.random() * state.playlist.length)
        : state.currentIndex === 0 
          ? state.playlist.length - 1 
          : state.currentIndex - 1;
      
      return {
        ...state,
        currentIndex: prevIndex,
        currentTrack: state.playlist[prevIndex] || null
      };
    
    default:
      return state;
  }
};

export const AudioProvider = ({ children }) => {
  const [state, dispatch] = useReducer(audioReducer, initialState);
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animationFrameRef = useRef(null);

  const initializeAudioContext = () => {
    if (!audioContextRef.current && audioRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
        
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
        
        analyserRef.current.fftSize = 512;
      } catch (error) {
        console.error('Failed to initialize audio context:', error);
      }
    }
  };

  const updateVisualizerData = () => {
    if (analyserRef.current && state.isVisualizerActive) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      dispatch({ type: 'SET_VISUALIZER_DATA', payload: dataArray });
    }
    
    if (state.isPlaying && state.isVisualizerActive) {
      animationFrameRef.current = requestAnimationFrame(updateVisualizerData);
    }
  };

  const setTracks = (tracks) => {
    dispatch({ type: 'SET_TRACKS', payload: tracks });
  };

  const playTrack = async (track, index) => {
    if (!audioRef.current) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_CURRENT_TRACK', payload: { track, index } });

      audioRef.current.src = track.url;
      audioRef.current.load();

      await audioRef.current.play();
      dispatch({ type: 'PLAY' });
      
      initializeAudioContext();
      
      if (state.isVisualizerActive) {
        updateVisualizerData();
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const play = async () => {
    if (!audioRef.current || !state.currentTrack) return;

    try {
      if (audioContextRef.current?.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      
      await audioRef.current.play();
      dispatch({ type: 'PLAY' });
      
      if (state.isVisualizerActive) {
        updateVisualizerData();
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      dispatch({ type: 'PAUSE' });
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      dispatch({ type: 'STOP' });
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  const seek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      dispatch({ type: 'SET_TIME', payload: time });
    }
  };

  const setVolume = (volume) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      dispatch({ type: 'SET_VOLUME', payload: volume });
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMutedState = !state.isMuted;
      audioRef.current.muted = newMutedState;
      dispatch({ type: 'TOGGLE_MUTE' });
    }
  };

  const nextTrack = () => {
    dispatch({ type: 'NEXT_TRACK' });
  };

  const previousTrack = () => {
    dispatch({ type: 'PREVIOUS_TRACK' });
  };

  const toggleShuffle = () => {
    dispatch({ type: 'SET_SHUFFLE', payload: !state.isShuffled });
  };

  const setRepeatMode = (mode) => {
    dispatch({ type: 'SET_REPEAT', payload: mode });
  };

  const toggleFullscreen = () => {
    dispatch({ type: 'TOGGLE_FULLSCREEN' });
  };

  const toggleVisualizer = () => {
    dispatch({ type: 'TOGGLE_VISUALIZER' });
    
    if (!state.isVisualizerActive && state.isPlaying) {
      initializeAudioContext();
      updateVisualizerData();
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      dispatch({ type: 'SET_TIME', payload: audio.currentTime });
    };

    const handleDurationChange = () => {
      dispatch({ type: 'SET_DURATION', payload: audio.duration });
    };

    const handleEnded = () => {
      if (state.repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else if (state.repeatMode === 'all' || state.currentIndex < state.playlist.length - 1) {
        nextTrack();
      } else {
        dispatch({ type: 'STOP' });
      }
    };

    const handleError = () => {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load audio' });
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [state.repeatMode, state.currentIndex, state.playlist.length]);

  useEffect(() => {
    if (state.currentTrack && state.currentIndex >= 0) {
      playTrack(state.currentTrack, state.currentIndex);
    }
  }, [state.currentIndex]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const value = {
    ...state,
    audioRef,
    setTracks,
    playTrack,
    play,
    pause,
    stop,
    seek,
    setVolume,
    toggleMute,
    nextTrack,
    previousTrack,
    toggleShuffle,
    setRepeatMode,
    toggleFullscreen,
    toggleVisualizer
  };

  return (
    <AudioContext.Provider value={value}>
      <audio ref={audioRef} preload="metadata" />
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export default AudioContext;