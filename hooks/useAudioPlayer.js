import { useState, useRef, useEffect, useCallback } from 'react';

export const useAudioPlayer = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none');
  const [playbackRate, setPlaybackRate] = useState(1);
  const [buffered, setBuffered] = useState(0);

  const initializeAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'metadata';
    }
    return audioRef.current;
  }, []);

  const updateTime = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      setCurrentTime(audio.currentTime);
      if (audio.buffered.length > 0) {
        setBuffered(audio.buffered.end(audio.buffered.length - 1));
      }
    }
  }, []);

  const updateDuration = useCallback(() => {
    const audio = audioRef.current;
    if (audio && !isNaN(audio.duration)) {
      setDuration(audio.duration);
    }
  }, []);

  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  const handleLoadedData = useCallback(() => {
    setIsLoading(false);
    updateDuration();
  }, [updateDuration]);

  const handleError = useCallback((e) => {
    setIsLoading(false);
    setIsPlaying(false);
    setError('Failed to load audio file');
    console.error('Audio error:', e);
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    
    if (repeatMode === 'one') {
      play();
    } else if (repeatMode === 'all' || currentTrackIndex < playlist.length - 1) {
      skipToNext();
    }
  }, [repeatMode, currentTrackIndex, playlist.length]);

  const setupAudioListeners = useCallback((audio) => {
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('durationchange', updateDuration);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('progress', updateTime);
  }, [updateTime, updateDuration, handleLoadStart, handleLoadedData, handleError, handleEnded]);

  const removeAudioListeners = useCallback((audio) => {
    audio.removeEventListener('timeupdate', updateTime);
    audio.removeEventListener('durationchange', updateDuration);
    audio.removeEventListener('loadstart', handleLoadStart);
    audio.removeEventListener('loadeddata', handleLoadedData);
    audio.removeEventListener('error', handleError);
    audio.removeEventListener('ended', handleEnded);
    audio.removeEventListener('progress', updateTime);
  }, [updateTime, updateDuration, handleLoadStart, handleLoadedData, handleError, handleEnded]);

  const loadTrack = useCallback((track) => {
    const audio = initializeAudio();
    
    if (currentTrack?.src !== track.src) {
      removeAudioListeners(audio);
      audio.src = track.src;
      setCurrentTrack(track);
      setCurrentTime(0);
      setDuration(0);
      setError(null);
      setupAudioListeners(audio);
    }
  }, [currentTrack, initializeAudio, removeAudioListeners, setupAudioListeners]);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    try {
      await audio.play();
      setIsPlaying(true);
      setError(null);
    } catch (err) {
      setError('Failed to play audio');
      setIsPlaying(false);
      console.error('Play error:', err);
    }
  }, [currentTrack]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const seek = useCallback((time) => {
    const audio = audioRef.current;
    if (audio && !isNaN(time)) {
      audio.currentTime = Math.max(0, Math.min(time, duration));
      setCurrentTime(audio.currentTime);
    }
  }, [duration]);

  const setVolumeLevel = useCallback((vol) => {
    const audio = audioRef.current;
    const newVolume = Math.max(0, Math.min(1, vol));
    
    if (audio) {
      audio.volume = newVolume;
    }
    
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  const skipToNext = useCallback(() => {
    if (playlist.length === 0) return;

    let nextIndex;
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      nextIndex = (currentTrackIndex + 1) % playlist.length;
    }

    setCurrentTrackIndex(nextIndex);
    loadTrack(playlist[nextIndex]);
    
    if (isPlaying) {
      setTimeout(() => play(), 100);
    }
  }, [playlist, currentTrackIndex, isShuffled, isPlaying, loadTrack, play]);

  const skipToPrevious = useCallback(() => {
    if (playlist.length === 0) return;

    if (currentTime > 3) {
      seek(0);
      return;
    }

    let prevIndex;
    if (isShuffled) {
      prevIndex = Math.floor(Math.random() * playlist.length);
    } else {
      prevIndex = currentTrackIndex === 0 ? playlist.length - 1 : currentTrackIndex - 1;
    }

    setCurrentTrackIndex(prevIndex);
    loadTrack(playlist[prevIndex]);
    
    if (isPlaying) {
      setTimeout(() => play(), 100);
    }
  }, [playlist, currentTrackIndex, currentTime, isShuffled, isPlaying, loadTrack, play, seek]);

  const playTrack = useCallback((track, index = 0) => {
    setCurrentTrackIndex(index);
    loadTrack(track);
    setTimeout(() => play(), 100);
  }, [loadTrack, play]);

  const setPlaylist = useCallback((tracks) => {
    setPlaylist(tracks);
    if (tracks.length > 0 && !currentTrack) {
      setCurrentTrackIndex(0);
      loadTrack(tracks[0]);
    }
  }, [currentTrack, loadTrack]);

  const toggleShuffle = useCallback(() => {
    setIsShuffled(prev => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeatMode(prev => {
      switch (prev) {
        case 'none': return 'all';
        case 'all': return 'one';
        case 'one': return 'none';
        default: return 'none';
      }
    });
  }, []);

  const changePlaybackRate = useCallback((rate) => {
    const audio = audioRef.current;
    const newRate = Math.max(0.25, Math.min(2, rate));
    
    if (audio) {
      audio.playbackRate = newRate;
    }
    
    setPlaybackRate(newRate);
  }, []);

  const getProgress = useCallback(() => {
    return duration > 0 ? (currentTime / duration) * 100 : 0;
  }, [currentTime, duration]);

  const getBufferedProgress = useCallback(() => {
    return duration > 0 ? (buffered / duration) * 100 : 0;
  }, [buffered, duration]);

  const formatTime = useCallback((time) => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    
    return () => {
      if (audio) {
        removeAudioListeners(audio);
        audio.pause();
        audio.src = '';
      }
    };
  }, [removeAudioListeners]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLoading,
    error,
    currentTrack,
    playlist,
    currentTrackIndex,
    isShuffled,
    repeatMode,
    playbackRate,
    buffered,
    play,
    pause,
    togglePlayPause,
    seek,
    setVolumeLevel,
    toggleMute,
    skipToNext,
    skipToPrevious,
    playTrack,
    loadTrack,
    setPlaylist,
    toggleShuffle,
    toggleRepeat,
    changePlaybackRate,
    getProgress,
    getBufferedProgress,
    formatTime,
    audioRef
  };
};