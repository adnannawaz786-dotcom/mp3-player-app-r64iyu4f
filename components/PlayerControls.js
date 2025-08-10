import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';

const PlayerControls = ({
  isPlaying,
  onPlayPause,
  onPrevious,
  onNext,
  onShuffle,
  onRepeat,
  isShuffled = false,
  repeatMode = 'off',
  volume = 1,
  onVolumeChange,
  isMuted = false,
  onMute,
  disabled = false,
  size = 'default'
}) => {
  const sizeClasses = {
    small: {
      button: 'h-8 w-8',
      playButton: 'h-10 w-10',
      icon: 'h-4 w-4',
      playIcon: 'h-5 w-5'
    },
    default: {
      button: 'h-10 w-10',
      playButton: 'h-12 w-12',
      icon: 'h-5 w-5',
      playIcon: 'h-6 w-6'
    },
    large: {
      button: 'h-12 w-12',
      playButton: 'h-16 w-16',
      icon: 'h-6 w-6',
      playIcon: 'h-8 w-8'
    }
  };

  const currentSize = sizeClasses[size];

  const getRepeatIcon = () => {
    if (repeatMode === 'one') {
      return (
        <div className="relative">
          <Repeat className={currentSize.icon} />
          <span className="absolute -top-1 -right-1 text-xs font-bold">1</span>
        </div>
      );
    }
    return <Repeat className={currentSize.icon} />;
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const playButtonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.9 }
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      {/* Shuffle Button */}
      <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
        <Button
          variant="ghost"
          size="icon"
          className={`${currentSize.button} ${
            isShuffled 
              ? 'text-blue-500 hover:text-blue-600' 
              : 'text-gray-400 hover:text-gray-600'
          } transition-colors`}
          onClick={onShuffle}
          disabled={disabled}
        >
          <Shuffle className={currentSize.icon} />
        </Button>
      </motion.div>

      {/* Previous Button */}
      <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
        <Button
          variant="ghost"
          size="icon"
          className={`${currentSize.button} text-gray-600 hover:text-gray-800 transition-colors`}
          onClick={onPrevious}
          disabled={disabled}
        >
          <SkipBack className={currentSize.icon} />
        </Button>
      </motion.div>

      {/* Play/Pause Button */}
      <motion.div variants={playButtonVariants} whileHover="hover" whileTap="tap">
        <Button
          variant="default"
          size="icon"
          className={`${currentSize.playButton} bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-colors`}
          onClick={onPlayPause}
          disabled={disabled}
        >
          {isPlaying ? (
            <Pause className={currentSize.playIcon} />
          ) : (
            <Play className={`${currentSize.playIcon} ml-0.5`} />
          )}
        </Button>
      </motion.div>

      {/* Next Button */}
      <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
        <Button
          variant="ghost"
          size="icon"
          className={`${currentSize.button} text-gray-600 hover:text-gray-800 transition-colors`}
          onClick={onNext}
          disabled={disabled}
        >
          <SkipForward className={currentSize.icon} />
        </Button>
      </motion.div>

      {/* Repeat Button */}
      <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
        <Button
          variant="ghost"
          size="icon"
          className={`${currentSize.button} ${
            repeatMode !== 'off' 
              ? 'text-blue-500 hover:text-blue-600' 
              : 'text-gray-400 hover:text-gray-600'
          } transition-colors`}
          onClick={onRepeat}
          disabled={disabled}
        >
          {getRepeatIcon()}
        </Button>
      </motion.div>

      {/* Volume Control */}
      {size !== 'small' && (
        <div className="flex items-center space-x-2 ml-4">
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button
              variant="ghost"
              size="icon"
              className={`${currentSize.button} text-gray-600 hover:text-gray-800 transition-colors`}
              onClick={onMute}
              disabled={disabled}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className={currentSize.icon} />
              ) : (
                <Volume2 className={currentSize.icon} />
              )}
            </Button>
          </motion.div>

          {size === 'large' && (
            <div className="w-20">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                disabled={disabled}
                className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(isMuted ? 0 : volume) * 100}%, #d1d5db ${(isMuted ? 0 : volume) * 100}%, #d1d5db 100%)`
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerControls;