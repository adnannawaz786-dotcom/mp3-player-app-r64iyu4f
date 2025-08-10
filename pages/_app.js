import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import '../styles/globals.css';

const AudioContext = createContext();

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
};

const AudioProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none');
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audioData, setAudioData] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);

  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = 'anonymous';
      
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
      } catch (err) {
        console.warn('Web Audio API not supported:', err);
      }

      const audio = audioRef.current;

      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
        setIsLoading(false);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };

      const handleEnded = () => {
        handleNext();
      };

      const handleError = (e) => {
        setError('Failed to load audio');
        setIsLoading(false);
        setIsPlaying(false);
      };

      const handleCanPlay = () => {
        setError(null);
        if (sourceRef.current && analyserRef.current) {
          try {
            sourceRef.current.connect(analyserRef.current);
            analyserRef.current.connect(audioContextRef.current.destination);
          } catch (err) {
            console.warn('Audio analysis connection failed:', err);
          }
        }
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);
      audio.addEventListener('canplay', handleCanPlay);

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('canplay', handleCanPlay);
        audio.pause();
      };
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      setIsLoading(true);
      setError(null);
      audioRef.current.src = currentTrack.url;
      
      if (audioContextRef.current && !sourceRef.current) {
        try {
          sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
        } catch (err) {
          console.warn('Failed to create audio source:', err);
        }
      }
    }
  }, [currentTrack]);

  const play = async () => {
    if (audioRef.current && currentTrack) {
      try {
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        await audioRef.current.play();
        setIsPlaying(true);
        setShowMiniPlayer(true);
      } catch (err) {
        setError('Failed to play audio');
        console.error('Play error:', err);
      }
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const seek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setTrack = (track, index = 0) => {
    setCurrentTrack(track);
    setCurrentIndex(index);
    setCurrentTime(0);
  };

  const handleNext = () => {
    if (playlist.length === 0) return;

    let nextIndex;
    if (repeatMode === 'one') {
      nextIndex = currentIndex;
    } else if (isShuffled) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      nextIndex = currentIndex + 1;
      if (nextIndex >= playlist.length) {
        if (repeatMode === 'all') {
          nextIndex = 0;
        } else {
          setIsPlaying(false);
          return;
        }
      }
    }

    setCurrentIndex(nextIndex);
    setCurrentTrack(playlist[nextIndex]);
  };

  const handlePrevious = () => {
    if (playlist.length === 0) return;

    if (currentTime > 3) {
      seek(0);
      return;
    }

    let prevIndex;
    if (isShuffled) {
      prevIndex = Math.floor(Math.random() * playlist.length);
    } else {
      prevIndex = currentIndex - 1;
      if (prevIndex < 0) {
        prevIndex = repeatMode === 'all' ? playlist.length - 1 : 0;
      }
    }

    setCurrentIndex(prevIndex);
    setCurrentTrack(playlist[prevIndex]);
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    const modes = ['none', 'all', 'one'];
    const currentModeIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentModeIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const getAudioData = () => {
    if (!analyserRef.current) return null;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    return {
      frequency: dataArray,
      bufferLength,
      analyser: analyserRef.current
    };
  };

  const addToPlaylist = (tracks) => {
    setPlaylist(prev => [...prev, ...tracks]);
  };

  const removeFromPlaylist = (index) => {
    setPlaylist(prev => prev.filter((_, i) => i !== index));
    if (index === currentIndex && playlist.length > 1) {
      const newIndex = index >= playlist.length - 1 ? 0 : index;
      setCurrentIndex(newIndex);
      setCurrentTrack(playlist[newIndex]);
    }
  };

  const clearPlaylist = () => {
    setPlaylist([]);
    setCurrentTrack(null);
    setCurrentIndex(0);
    pause();
  };

  const value = {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    playlist,
    currentIndex,
    isLoading,
    error,
    isFullscreen,
    showMiniPlayer,
    audioRef,
    play,
    pause,
    togglePlay,
    seek,
    setTrack,
    handleNext,
    handlePrevious,
    toggleShuffle,
    toggleRepeat,
    toggleMute,
    setVolume,
    getAudioData,
    addToPlaylist,
    removeFromPlaylist,
    clearPlaylist,
    setIsFullscreen,
    setShowMiniPlayer,
    setPlaylist
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};

export default function App({ Component, pageProps }) {
  return (
    <AudioProvider>
      <AnimatePresence mode="wait" initial={false}>
        <Component {...pageProps} />
      </AnimatePresence>
    </AudioProvider>
  );
}