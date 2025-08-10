import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Music, PlayCircle, Settings, Menu, X, Volume2, VolumeX, SkipBack, SkipForward, Play, Pause, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Separator } from './ui/separator';

const Layout = ({ children, currentTrack, isPlaying, onPlayPause, onNext, onPrevious, onToggleFullscreen, isFullscreen, volume, onVolumeChange, isMuted, onToggleMute, progress, duration, onSeek }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);

  useEffect(() => {
    setShowMiniPlayer(!!currentTrack && !isFullscreen);
  }, [currentTrack, isFullscreen]);

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'music', label: 'Music', icon: Music },
    { id: 'player', label: 'Player', icon: PlayCircle },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeekChange = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    onSeek && onSeek(newTime);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="flex flex-col h-screen">
        <header className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              MusicPlayer
            </h1>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>

          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(item.id)}
                  className={`relative ${
                    activeTab === item.id 
                      ? 'bg-purple-600 hover:bg-purple-700' 
                      : 'hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                  {activeTab === item.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-purple-600 rounded-md -z-10"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Button>
              );
            })}
          </nav>
        </header>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/30 backdrop-blur-md border-b border-white/10"
            >
              <nav className="flex flex-col p-4 space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={activeTab === item.id ? "default" : "ghost"}
                      size="sm"
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`justify-start ${
                        activeTab === item.id 
                          ? 'bg-purple-600 hover:bg-purple-700' 
                          : 'hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {item.label}
                    </Button>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        <main className={`flex-1 overflow-auto ${showMiniPlayer ? 'pb-20' : 'pb-4'}`}>
          {children}
        </main>

        <AnimatePresence>
          {showMiniPlayer && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-0 left-0 right-0 z-50"
            >
              <Card className="mx-4 mb-4 bg-black/40 backdrop-blur-md border-white/20 text-white">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Music className="w-6 h-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm truncate">
                          {currentTrack?.title || 'Unknown Track'}
                        </h3>
                        <p className="text-xs text-gray-400 truncate">
                          {currentTrack?.artist || 'Unknown Artist'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onPrevious}
                        className="w-8 h-8 p-0 hover:bg-white/10"
                      >
                        <SkipBack className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onPlayPause}
                        className="w-10 h-10 p-0 bg-purple-600 hover:bg-purple-700"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onNext}
                        className="w-8 h-8 p-0 hover:bg-white/10"
                      >
                        <SkipForward className="w-4 h-4" />
                      </Button>

                      <Separator orientation="vertical" className="h-6 bg-white/20" />

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onToggleMute}
                        className="w-8 h-8 p-0 hover:bg-white/10"
                      >
                        {isMuted ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onToggleFullscreen}
                        className="w-8 h-8 p-0 hover:bg-white/10"
                      >
                        {isFullscreen ? (
                          <Minimize2 className="w-4 h-4" />
                        ) : (
                          <Maximize2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-gray-400 w-10 text-right">
                      {formatTime(progress)}
                    </span>
                    
                    <div 
                      className="flex-1 h-1 bg-white/20 rounded-full cursor-pointer relative group"
                      onClick={handleSeekChange}
                    >
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full relative"
                        style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
                      >
                        <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    
                    <span className="text-gray-400 w-10">
                      {formatTime(duration)}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Layout;