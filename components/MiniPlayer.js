import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

const MiniPlayer = ({ onExpand, isVisible = true }) => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isLoading,
    play,
    pause,
    nextTrack,
    previousTrack,
    seek,
    setVolume,
    toggleFavorite
  } = useAudioPlayer();

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = (e) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    seek(newTime);
  };

  const handleVolumeChange = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    setVolume(percentage);
  };

  if (!currentTrack || !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-900/95 to-blue-900/95 backdrop-blur-lg border-t border-white/10"
      >
        <Card className="bg-transparent border-none shadow-none">
          <div className="px-4 py-3">
            <div 
              className="w-full h-1 bg-white/20 rounded-full cursor-pointer mb-3 group"
              onClick={handleProgressClick}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full relative"
                style={{ width: `${progress}%` }}
                whileHover={{ height: '6px' }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <motion.div
                  className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500 flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {currentTrack.artwork ? (
                    <img
                      src={currentTrack.artwork}
                      alt={currentTrack.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Volume2 className="w-6 h-6 text-white" />
                    </div>
                  )}
                </motion.div>

                <div className="flex-1 min-w-0">
                  <motion.h3
                    className="text-white font-medium text-sm truncate"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={currentTrack.id}
                  >
                    {currentTrack.title}
                  </motion.h3>
                  <motion.p
                    className="text-white/70 text-xs truncate"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    key={`${currentTrack.id}-artist`}
                  >
                    {currentTrack.artist}
                  </motion.p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white hover:bg-white/10 w-8 h-8 p-0"
                  onClick={() => toggleFavorite(currentTrack.id)}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      currentTrack.isFavorite ? 'fill-red-500 text-red-500' : ''
                    }`}
                  />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white hover:bg-white/10 w-8 h-8 p-0"
                  onClick={previousTrack}
                >
                  <SkipBack className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-white hover:bg-white/20 w-10 h-10 p-0 bg-white/10"
                  onClick={isPlaying ? pause : play}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  ) : isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white hover:bg-white/10 w-8 h-8 p-0"
                  onClick={nextTrack}
                >
                  <SkipForward className="w-4 h-4" />
                </Button>

                <div className="hidden sm:flex items-center space-x-2 ml-2">
                  <Volume2 className="w-4 h-4 text-white/70" />
                  <div
                    className="w-16 h-1 bg-white/20 rounded-full cursor-pointer group"
                    onClick={handleVolumeChange}
                  >
                    <motion.div
                      className="h-full bg-white rounded-full relative"
                      style={{ width: `${volume * 100}%` }}
                      whileHover={{ height: '4px' }}
                    >
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white hover:bg-white/10 w-8 h-8 p-0"
                  onClick={onExpand}
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center mt-2 text-xs text-white/50">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default MiniPlayer;