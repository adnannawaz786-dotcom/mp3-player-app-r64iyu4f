import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Slider } from '../components/ui/slider';
import { Badge } from '../components/ui/badge';

export default function PlayerPage() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off');
  const [isLiked, setIsLiked] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [visualizerData, setVisualizerData] = useState([]);

  const currentTrack = {
    id: 1,
    title: "Midnight Dreams",
    artist: "Luna Eclipse",
    album: "Nocturnal Vibes",
    duration: 245,
    cover: "/api/placeholder/400/400",
    genre: "Electronic",
    year: "2024"
  };

  const lyrics = [
    { time: 0, text: "In the silence of the night" },
    { time: 15, text: "Stars are dancing in the light" },
    { time: 30, text: "Dreams are calling out my name" },
    { time: 45, text: "Nothing will ever be the same" },
    { time: 60, text: "Midnight dreams, they come alive" },
    { time: 75, text: "In this moment we survive" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying && currentTime < duration) {
        setCurrentTime(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration]);

  useEffect(() => {
    setDuration(currentTrack.duration);
  }, [currentTrack]);

  useEffect(() => {
    const generateVisualizerData = () => {
      const data = Array.from({ length: 64 }, () => 
        Math.random() * (isPlaying ? 100 : 20)
      );
      setVisualizerData(data);
    };

    const interval = setInterval(generateVisualizerData, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value) => {
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value) => {
    setVolume(value[0]);
    setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    const modes = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const goBack = () => {
    router.back();
  };

  const currentLyric = lyrics.find((lyric, index) => {
    const nextLyric = lyrics[index + 1];
    return currentTime >= lyric.time && (!nextLyric || currentTime < nextLyric.time);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/20" />
      
      <div className="relative z-10 flex flex-col h-screen">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4"
        >
          <Button 
            variant="ghost" 
            size="icon"
            onClick={goBack}
            className="text-white hover:bg-white/10"
          >
            <ChevronDown className="h-6 w-6" />
          </Button>
          
          <div className="text-center">
            <p className="text-sm opacity-70">Playing from</p>
            <p className="font-medium">{currentTrack.album}</p>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/10"
          >
            <MoreHorizontal className="h-6 w-6" />
          </Button>
        </motion.header>

        <div className="flex-1 flex flex-col items-center justify-center px-6 space-y-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="w-80 h-80 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={currentTrack.cover} 
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <motion.div 
              className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl"
              animate={{ 
                scale: isPlaying ? [1, 1.05, 1] : 1,
                opacity: isPlaying ? [0.5, 0.8, 0.5] : 0.3
              }}
              transition={{ 
                duration: 2, 
                repeat: isPlaying ? Infinity : 0,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center space-y-2"
          >
            <h1 className="text-3xl font-bold">{currentTrack.title}</h1>
            <p className="text-xl opacity-70">{currentTrack.artist}</p>
            <div className="flex items-center justify-center space-x-2">
              <Badge variant="secondary" className="bg-white/10 text-white">
                {currentTrack.genre}
              </Badge>
              <Badge variant="secondary" className="bg-white/10 text-white">
                {currentTrack.year}
              </Badge>
            </div>
          </motion.div>

          <div className="w-full max-w-md space-y-4">
            <div className="space-y-2">
              <Slider
                value={[currentTime]}
                max={duration}
                step={1}
                onValueChange={handleSeek}
                className="w-full"
              />
              <div className="flex justify-between text-sm opacity-70">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleShuffle}
                className={`text-white hover:bg-white/10 ${isShuffled ? 'text-green-400' : ''}`}
              >
                <Shuffle className="h-5 w-5" />
              </Button>

              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                >
                  <SkipBack className="h-6 w-6" />
                </Button>

                <Button
                  onClick={togglePlay}
                  size="icon"
                  className="w-16 h-16 rounded-full bg-white text-black hover:bg-gray-100"
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <Play className="h-8 w-8 ml-1" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                >
                  <SkipForward className="h-6 w-6" />
                </Button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleRepeat}
                className={`text-white hover:bg-white/10 ${repeatMode !== 'off' ? 'text-green-400' : ''}`}
              >
                <Repeat className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLike}
                className={`text-white hover:bg-white/10 ${isLiked ? 'text-red-400' : ''}`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              </Button>

              <div className="flex items-center space-x-2 flex-1 max-w-32 mx-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/10"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="flex-1"
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                <Share className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <motion.div 
            className="w-full max-w-md h-16 flex items-end justify-center space-x-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {visualizerData.map((height, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-t from-purple-400 to-blue-400 w-1 rounded-full"
                style={{ height: `${height}%` }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.1 }}
              />
            ))}
          </motion.div>

          {showLyrics && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="text-lg font-medium">
                {currentLyric?.text || "♪ Instrumental ♪"}
              </p>
            </motion.div>
          )}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="p-4"
        >
          <Button
            variant="ghost"
            onClick={() => setShowLyrics(!showLyrics)}
            className="w-full text-white hover:bg-white/10"
          >
            {showLyrics ? 'Hide Lyrics' : 'Show Lyrics'}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}