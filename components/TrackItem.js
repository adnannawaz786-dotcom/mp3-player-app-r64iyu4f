import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

const TrackItem = ({ 
  track, 
  isPlaying, 
  isCurrentTrack, 
  onPlay, 
  onPause, 
  onClick,
  index 
}) => {
  const handlePlayPause = (e) => {
    e.stopPropagation();
    if (isCurrentTrack && isPlaying) {
      onPause();
    } else {
      onPlay(track);
    }
  };

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
          isCurrentTrack 
            ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30' 
            : 'bg-white/5 hover:bg-white/10 border-white/10'
        }`}
        onClick={() => onClick(track)}
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center ${
              isCurrentTrack ? 'shadow-lg shadow-purple-500/25' : ''
            }`}>
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-full p-0 hover:bg-transparent"
                onClick={handlePlayPause}
              >
                {isCurrentTrack && isPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white ml-0.5" />
                )}
              </Button>
            </div>
            {isCurrentTrack && isPlaying && (
              <motion.div
                className="absolute -inset-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 opacity-75"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ zIndex: -1 }}
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold truncate ${
              isCurrentTrack ? 'text-purple-300' : 'text-white'
            }`}>
              {track.title}
            </h3>
            <p className="text-sm text-gray-400 truncate">
              {track.artist}
            </p>
            {track.album && (
              <p className="text-xs text-gray-500 truncate">
                {track.album}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400 min-w-[40px] text-right">
              {formatDuration(track.duration)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 hover:bg-white/10"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </Button>
          </div>
        </div>

        {isCurrentTrack && (
          <motion.div
            className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${(track.currentTime / track.duration) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};

export default TrackItem;