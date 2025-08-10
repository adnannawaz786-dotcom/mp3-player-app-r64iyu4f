import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Grid, List, Play, Pause, Heart, MoreVertical, Clock, Calendar, Music } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';

const Library = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

  const mockTracks = [
    {
      id: 1,
      title: 'Midnight Dreams',
      artist: 'Luna Eclipse',
      album: 'Nocturnal Vibes',
      duration: '3:45',
      genre: 'Electronic',
      year: 2023,
      plays: 1250,
      liked: true,
      cover: '/api/placeholder/300/300'
    },
    {
      id: 2,
      title: 'Ocean Waves',
      artist: 'Coastal Sounds',
      album: 'Natural Harmony',
      duration: '4:12',
      genre: 'Ambient',
      year: 2022,
      plays: 890,
      liked: false,
      cover: '/api/placeholder/300/300'
    },
    {
      id: 3,
      title: 'City Lights',
      artist: 'Urban Pulse',
      album: 'Metropolitan',
      duration: '3:28',
      genre: 'Pop',
      year: 2023,
      plays: 2100,
      liked: true,
      cover: '/api/placeholder/300/300'
    },
    {
      id: 4,
      title: 'Forest Path',
      artist: 'Nature\'s Call',
      album: 'Wilderness',
      duration: '5:03',
      genre: 'Folk',
      year: 2021,
      plays: 675,
      liked: false,
      cover: '/api/placeholder/300/300'
    },
    {
      id: 5,
      title: 'Electric Storm',
      artist: 'Thunder Bay',
      album: 'Weather Patterns',
      duration: '4:35',
      genre: 'Rock',
      year: 2023,
      plays: 1800,
      liked: true,
      cover: '/api/placeholder/300/300'
    },
    {
      id: 6,
      title: 'Sunset Boulevard',
      artist: 'Golden Hour',
      album: 'Evening Moods',
      duration: '3:52',
      genre: 'Jazz',
      year: 2022,
      plays: 950,
      liked: false,
      cover: '/api/placeholder/300/300'
    }
  ];

  const genres = ['all', 'Electronic', 'Ambient', 'Pop', 'Folk', 'Rock', 'Jazz'];

  const filteredTracks = useMemo(() => {
    let filtered = mockTracks.filter(track => {
      const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          track.album.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = selectedGenre === 'all' || track.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'artist':
          return a.artist.localeCompare(b.artist);
        case 'year':
          return b.year - a.year;
        case 'plays':
          return b.plays - a.plays;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedGenre, sortBy]);

  const handlePlayPause = (trackId) => {
    if (currentlyPlaying === trackId) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(trackId);
    }
  };

  const formatDuration = (duration) => {
    return duration;
  };

  const formatPlays = (plays) => {
    if (plays >= 1000) {
      return `${(plays / 1000).toFixed(1)}k`;
    }
    return plays.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Music Library
          </h1>
          <p className="text-slate-400">Discover and manage your music collection</p>
        </motion.div>

        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tracks, artists, albums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-slate-400"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              >
                {genres.map(genre => (
                  <option key={genre} value={genre} className="bg-slate-800">
                    {genre === 'all' ? 'All Genres' : genre}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              >
                <option value="name" className="bg-slate-800">Sort by Name</option>
                <option value="artist" className="bg-slate-800">Sort by Artist</option>
                <option value="year" className="bg-slate-800">Sort by Year</option>
                <option value="plays" className="bg-slate-800">Sort by Plays</option>
              </select>

              <div className="flex bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {genres.slice(1).map(genre => (
              <Badge
                key={genre}
                variant={selectedGenre === genre ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-purple-500/20 transition-colors"
                onClick={() => setSelectedGenre(selectedGenre === genre ? 'all' : genre)}
              >
                {genre}
              </Badge>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredTracks.map((track) => (
                  <motion.div
                    key={track.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -5 }}
                    className="group"
                  >
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="relative mb-4">
                          <div className="aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Music className="w-12 h-12 text-white/80" />
                          </div>
                          <Button
                            size="sm"
                            className="absolute bottom-2 right-2 rounded-full w-10 h-10 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-purple-500 hover:bg-purple-600"
                            onClick={() => handlePlayPause(track.id)}
                          >
                            {currentlyPlaying === track.id ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4 ml-0.5" />
                            )}
                          </Button>
                        </div>
                        <h3 className="font-semibold text-white truncate mb-1">{track.title}</h3>
                        <p className="text-slate-400 text-sm truncate mb-2">{track.artist}</p>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{track.duration}</span>
                          <span>{formatPlays(track.plays)} plays</span>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <Badge variant="outline" className="text-xs">
                            {track.genre}
                          </Badge>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                              <Heart className={`w-4 h-4 ${track.liked ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                            </Button>
                            <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                              <MoreVertical className="w-4 h-4 text-slate-400" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left p-4 text-slate-400 font-medium">#</th>
                        <th className="text-left p-4 text-slate-400 font-medium">Title</th>
                        <th className="text-left p-4 text-slate-400 font-medium">Artist</th>
                        <th className="text-left p-4 text-slate-400 font-medium">Album</th>
                        <th className="text-left p-4 text-slate-400 font-medium">Genre</th>
                        <th className="text-left p-4 text-slate-400 font-medium">
                          <Clock className="w-4 h-4" />
                        </th>
                        <th className="text-left p-4 text-slate-400 font-medium">Plays</th>
                        <th className="text-left p-4 text-slate-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {filteredTracks.map((track, index) => (
                          <motion.tr
                            key={track.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="border-b border-white/10 hover:bg-white/5 transition-colors group"
                          >
                            <td className="p-4">
                              <div className="flex items-center justify-center w-8 h-8">
                                {currentlyPlaying === track.id ? (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="w-8 h-8 p-0"
                                    onClick={() => handlePlayPause(track.id)}
                                  >
                                    <Pause className="w-4 h-4" />
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100"
                                    onClick={() => handlePlayPause(track.id)}
                                  >
                                    <Play className="w-4 h-4 ml-0.5" />
                                  </Button>
                                )}
                                <span className={`text-slate-400 text-sm ${currentlyPlaying === track.id || 'group-hover:hidden'}`}>
                                  {index + 1}
                                </span>
                              </div>
                            </td>
                            <td className="p-