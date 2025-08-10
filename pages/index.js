import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Volume2, Shuffle, Repeat, Music, Search, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';

const sampleTracks = [
  {
    id: 1,
    title: "Midnight Dreams",
    artist: "Luna Echo",
    album: "Nocturnal Vibes",
    duration: "3:45",
    genre: "Electronic",
    url: "/audio/sample1.mp3"
  },
  {
    id: 2,
    title: "Ocean Waves",
    artist: "Coastal Sounds",
    album: "Nature's Symphony",
    duration: "4:12",
    genre: "Ambient",
    url: "/audio/sample2.mp3"
  },
  {
    id: 3,
    title: "City Lights",
    artist: "Urban Pulse",
    album: "Metropolitan",
    duration: "3:28",
    genre: "Pop",
    url: "/audio/sample3.mp3"
  },
  {
    id: 4,
    title: "Mountain High",
    artist: "Alpine Winds",
    album: "Elevation",
    duration: "5:03",
    genre: "Rock",
    url: "/audio/sample4.mp3"
  },
  {
    id: 5,
    title: "Jazz Cafe",
    artist: "Smooth Operators",
    album: "Late Night Sessions",
    duration: "4:35",
    genre: "Jazz",
    url: "/audio/sample5.mp3"
  }
];

export default function Home() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [audio, setAudio] = useState(null);
  const [visualizerData, setVisualizerData] = useState([]);

  const genres = ['all', ...new Set(sampleTracks.map(track => track.genre))];
  
  const filteredTracks = sampleTracks.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         track.artist.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || track.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  useEffect(() => {
    if (currentTrack) {
      const newAudio = new Audio(currentTrack.url);
      setAudio(newAudio);

      newAudio.addEventListener('loadedmetadata', () => {
        setDuration(newAudio.duration);
      });

      newAudio.addEventListener('timeupdate', () => {
        setCurrentTime(newAudio.currentTime);
      });

      newAudio.addEventListener('ended', () => {
        handleNext();
      });

      return () => {
        newAudio.pause();
        newAudio.removeEventListener('loadedmetadata', () => {});
        newAudio.removeEventListener('timeupdate', () => {});
        newAudio.removeEventListener('ended', () => {});
      };
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audio) {
      audio.volume = volume;
      if (isPlaying) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  }, [isPlaying, volume, audio]);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisualizerData(Array.from({ length: 20 }, () => Math.random() * 100));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handlePlayPause = () => {
    if (!currentTrack && filteredTracks.length > 0) {
      setCurrentTrack(filteredTracks[0]);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleTrackSelect = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handleNext = () => {
    if (!currentTrack) return;
    const currentIndex = filteredTracks.findIndex(track => track.id === currentTrack.id);
    let nextIndex;
    
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * filteredTracks.length);
    } else {
      nextIndex = (currentIndex + 1) % filteredTracks.length;
    }
    
    setCurrentTrack(filteredTracks[nextIndex]);
  };

  const handlePrevious = () => {
    if (!currentTrack) return;
    const currentIndex = filteredTracks.findIndex(track => track.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? filteredTracks.length - 1 : currentIndex - 1;
    setCurrentTrack(filteredTracks[prevIndex]);
  };

  const handleSeek = (e) => {
    if (audio) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * duration;
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Music Player
          </h1>
          <p className="text-gray-300">Discover and enjoy your favorite tracks</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-6">
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Music className="w-5 h-5" />
                    Track Library
                  </CardTitle>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search tracks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full sm:w-48"
                      />
                    </div>
                    <select
                      value={selectedGenre}
                      onChange={(e) => setSelectedGenre(e.target.value)}
                      className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      {genres.map(genre => (
                        <option key={genre} value={genre} className="bg-gray-800">
                          {genre.charAt(0).toUpperCase() + genre.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <AnimatePresence>
                    {filteredTracks.map((track, index) => (
                      <motion.div
                        key={track.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                          currentTrack?.id === track.id
                            ? 'bg-purple-500/30 border border-purple-400'
                            : 'bg-white/5 hover:bg-white/10 border border-transparent'
                        }`}
                        onClick={() => handleTrackSelect(track)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">{track.title}</h3>
                            <p className="text-gray-300 text-sm">{track.artist} • {track.album}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                              {track.genre}
                            </Badge>
                            <span className="text-gray-400 text-sm">{track.duration}</span>
                            {currentTrack?.id === track.id && isPlaying && (
                              <div className="w-4 h-4 bg-purple-400 rounded-full animate-pulse" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-center">Audio Visualizer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-center gap-1 h-32">
                  {visualizerData.map((height, index) => (
                    <motion.div
                      key={index}
                      className="bg-gradient-to-t from-purple-500 to-pink-400 w-3 rounded-t"
                      style={{ height: `${height}%` }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {currentTrack && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="sticky top-4"
              >
                <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <h3 className="font-bold text-lg text-white">{currentTrack.title}</h3>
                      <p className="text-gray-300">{currentTrack.artist}</p>
                      <p className="text-gray-400 text-sm">{currentTrack.album}</p>
                    </div>

                    <div className="mb-4">
                      <div
                        className="w-full h-2 bg-white/20 rounded-full cursor-pointer"
                        onClick={handleSeek}
                      >
                        <div
                          className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                          style={{ width: `${(currentTime / duration) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-4 mb-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsShuffled(!isShuffled)}
                        className={`text-white hover:bg-white/20 ${isShuffled ? 'text-purple-400' : ''}`}
                      >
                        <Shuffle className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handlePrevious}
                        className="text-white hover:bg-white/20"
                      >
                        <SkipBack className="w-5 h-5" />
                      </Button>
                      <Button
                        onClick={handlePlayPause}
                        className="bg-purple-500 hover:bg-purple-600 text-white rounded-full w-12 h-12"
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleNext}
                        className="text-white hover:bg-white/20"
                      >
                        <SkipForward className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setRepeatMode(repeatMode === 'none' ? 'one' : 'none')}
                        className={`text-white hover:bg-white/20 ${repeatMode !== 'none' ? 'text-purple-400' : ''}`}
                      >
                        <Repeat className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-gray-400" />
                      <input