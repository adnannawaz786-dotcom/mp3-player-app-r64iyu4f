'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Repeat, 
  Shuffle, 
  Heart,
  MoreHorizontal,
  ChevronDown,
  Share,
  Download
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

export default function FullPlayer({ 
  currentTrack, 
  isPlaying, 
  onPlayPause, 
  onNext, 
  onPrevious,
  onClose,
  currentTime = 0,
  duration = 0,
  volume = 1,
  onVolumeChange,
  onSeek,
  isShuffled = false,
  isRepeating = false,
  onShuffle,
  onRepeat,
  visualizerData = []
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const progressRef = useRef(null);
  const volumeRef = useRef(null);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e) => {
    if (progressRef.current && onSeek) {
      const rect = progressRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      onSeek(percent * duration);
    }
  };

  const handleVolumeClick = (e) => {
    if (volumeRef.current && onVolumeChange) {
      const rect = volumeRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      onVolumeChange(Math.max(0, Math.min(1, percent)));
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (onVolumeChange) {
      onVolumeChange(isMuted ? volume : 0);
    }
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  if (!currentTrack) return null;

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden"
    >
      <div className="absolute inset-0 bg-black/20" />
      
      <div className="relative h-full flex flex-col">
        <div className="flex items-center justify-between p-4 md:p-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            <ChevronDown className="w-6 h-6" />
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-white/60">Playing from</p>
            <p className="text-sm font-medium">My Playlist</p>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            <MoreHorizontal className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 md:px-12">
          <motion.div
            className="relative mb-8"
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 20, repeat: isPlaying ? Infinity : 0, ease: 'linear' }}
          >
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 p-2 shadow-2xl">
              <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                {currentTrack.artwork ? (
                  <img 
                    src={currentTrack.artwork} 
                    alt={currentTrack.title}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center">
                    <span className="text-4xl font-bold text-white/50">
                      {currentTrack.title?.charAt(0) || '♪'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
          </motion.div>

          <div className="text-center mb-8 max-w-md">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 truncate">
              {currentTrack.title}
            </h1>
            <p className="text-lg text-white/70 mb-4 truncate">
              {currentTrack.artist}
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                {currentTrack.genre || 'Music'}
              </Badge>
              {currentTrack.duration && (
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                  {formatTime(currentTrack.duration)}
                </Badge>
              )}
            </div>
          </div>

          <div className="w-full max-w-md mb-8">
            <div 
              ref={progressRef}
              className="relative h-2 bg-white/20 rounded-full cursor-pointer mb-2"
              onClick={handleProgressClick}
            >
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
              <motion.div
                className="absolute top-1/2 w-4 h-4 bg-white rounded-full shadow-lg transform -translate-y-1/2"
                style={{ left: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            </div>
            
            <div className="flex justify-between text-sm text-white/60">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={onShuffle}
              className={`text-white/80 hover:text-white hover:bg-white/10 ${
                isShuffled ? 'text-purple-400' : ''
              }`}
            >
              <Shuffle className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="lg"
              onClick={onPrevious}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <SkipBack className="w-6 h-6" />
            </Button>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                onClick={onPlayPause}
                className="w-16 h-16 rounded-full bg-white text-black hover:bg-white/90 shadow-2xl"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8 ml-1" />
                )}
              </Button>
            </motion.div>
            
            <Button
              variant="ghost"
              size="lg"
              onClick={onNext}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <SkipForward className="w-6 h-6" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onRepeat}
              className={`text-white/80 hover:text-white hover:bg-white/10 ${
                isRepeating ? 'text-purple-400' : ''
              }`}
            >
              <Repeat className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLike}
              className={`text-white/80 hover:text-white hover:bg-white/10 ${
                isLiked ? 'text-red-400' : ''
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                onMouseEnter={() => setShowVolumeSlider(true)}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>
              
              <AnimatePresence>
                {showVolumeSlider && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 100 }}
                    exit={{ opacity: 0, width: 0 }}
                    onMouseLeave={() => setShowVolumeSlider(false)}
                    className="relative"
                  >
                    <div
                      ref={volumeRef}
                      className="h-2 bg-white/20 rounded-full cursor-pointer"
                      onClick={handleVolumeClick}
                    >
                      <div
                        className="h-full bg-white rounded-full"
                        style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <Share className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {visualizerData.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-center gap-1 px-4 opacity-30">
            {visualizerData.slice(0, 50).map((value, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-t from-purple-400 to-pink-400 w-1 rounded-t"
                animate={{ height: `${Math.max(2, value * 100)}px` }}
                transition={{ duration: 0.1 }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}