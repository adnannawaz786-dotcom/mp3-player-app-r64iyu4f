import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Music, Clock, MoreVertical } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const TrackList = ({ 
  tracks = [], 
  currentTrack, 
  isPlaying, 
  onTrackSelect, 
  onPlayPause,
  className = '' 
}) => {
  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTrackNumber = (index) => {
    return (index + 1).toString().padStart(2, '0');
  };

  const handleTrackClick = (track, index) => {
    if (currentTrack?.id === track.id) {
      onPlayPause();
    } else {
      onTrackSelect(track, index);
    }
  };

  const TrackItem = ({ track, index, isActive, isCurrentlyPlaying }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`group relative overflow-hidden rounded-lg transition-all duration-300 ${
        isActive 
          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30' 
          : 'bg-white/5 hover:bg-white/10 border border-white/10'
      }`}
    >
      <div className="flex items-center gap-4 p-4">
        <div className="relative flex-shrink-0">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 ${
            isActive ? 'bg-blue-500/30' : 'bg-white/10 group-hover:bg-white/20'
          }`}>
            {track.artwork ? (
              <img 
                src={track.artwork} 
                alt={track.title}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Music className="w-6 h-6 text-white/60" />
            )}
          </div>
          
          <motion.div
            initial={false}
            animate={{ 
              opacity: isActive ? 1 : 0,
              scale: isActive ? 1 : 0.8
            }}
            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg backdrop-blur-sm"
          >
            <Button
              size="sm"
              variant="ghost"
              className="w-8 h-8 p-0 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                handleTrackClick(track, index);
              }}
            >
              {isCurrentlyPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
          </motion.div>
        </div>

        <div 
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => handleTrackClick(track, index)}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-mono ${
              isActive ? 'text-blue-400' : 'text-white/40'
            }`}>
              {getTrackNumber(index)}
            </span>
            <h3 className={`font-medium truncate transition-colors ${
              isActive ? 'text-white' : 'text-white/90 group-hover:text-white'
            }`}>
              {track.title}
            </h3>
            {isActive && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex-shrink-0"
              >
                <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                  Now Playing
                </Badge>
              </motion.div>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-white/60">
            <span className="truncate">{track.artist}</span>
            {track.album && (
              <>
                <span>•</span>
                <span className="truncate">{track.album}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-1 text-white/60">
            <Clock className="w-3 h-3" />
            <span className="text-xs font-mono">
              {formatDuration(track.duration)}
            </span>
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            className="w-8 h-8 p-0 text-white/60 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isActive && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 origin-left"
        />
      )}
    </motion.div>
  );

  if (!tracks.length) {
    return (
      <Card className={`p-8 text-center bg-white/5 border-white/10 ${className}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
            <Music className="w-8 h-8 text-white/40" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white/90 mb-2">No tracks available</h3>
            <p className="text-white/60">Add some music to get started</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Playlist</h2>
        <Badge variant="outline" className="text-white/70 border-white/20">
          {tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}
        </Badge>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        <AnimatePresence mode="popLayout">
          {tracks.map((track, index) => {
            const isActive = currentTrack?.id === track.id;
            const isCurrentlyPlaying = isActive && isPlaying;
            
            return (
              <TrackItem
                key={track.id}
                track={track}
                index={index}
                isActive={isActive}
                isCurrentlyPlaying={isCurrentlyPlaying}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TrackList;