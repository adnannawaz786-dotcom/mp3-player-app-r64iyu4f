import { useState, useEffect, useRef, useCallback } from 'react';

export const useAudioVisualizer = (audioElement, isPlaying) => {
  const [analyserData, setAnalyserData] = useState(new Uint8Array(0));
  const [isVisualizerActive, setIsVisualizerActive] = useState(false);
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const animationFrameRef = useRef(null);
  const dataArrayRef = useRef(null);

  const initializeVisualizer = useCallback(() => {
    if (!audioElement || audioContextRef.current) return;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaElementSource(audioElement);

      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      analyser.minDecibels = -90;
      analyser.maxDecibels = -10;

      source.connect(analyser);
      analyser.connect(audioContext.destination);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      sourceRef.current = source;
      dataArrayRef.current = dataArray;

      setAnalyserData(new Uint8Array(bufferLength));
      setIsVisualizerActive(true);
    } catch (error) {
      console.error('Failed to initialize audio visualizer:', error);
      setIsVisualizerActive(false);
    }
  }, [audioElement]);

  const updateVisualizerData = useCallback(() => {
    if (!analyserRef.current || !dataArrayRef.current) return;

    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    setAnalyserData(new Uint8Array(dataArrayRef.current));

    if (isPlaying && isVisualizerActive) {
      animationFrameRef.current = requestAnimationFrame(updateVisualizerData);
    }
  }, [isPlaying, isVisualizerActive]);

  const startVisualizer = useCallback(() => {
    if (!isVisualizerActive || !analyserRef.current) return;

    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }

    updateVisualizerData();
  }, [isVisualizerActive, updateVisualizerData]);

  const stopVisualizer = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const getFrequencyData = useCallback(() => {
    return analyserData;
  }, [analyserData]);

  const getAverageFrequency = useCallback(() => {
    if (analyserData.length === 0) return 0;
    
    const sum = analyserData.reduce((acc, value) => acc + value, 0);
    return sum / analyserData.length;
  }, [analyserData]);

  const getBassFrequency = useCallback(() => {
    if (analyserData.length === 0) return 0;
    
    const bassRange = analyserData.slice(0, Math.floor(analyserData.length * 0.1));
    const sum = bassRange.reduce((acc, value) => acc + value, 0);
    return bassRange.length > 0 ? sum / bassRange.length : 0;
  }, [analyserData]);

  const getMidFrequency = useCallback(() => {
    if (analyserData.length === 0) return 0;
    
    const start = Math.floor(analyserData.length * 0.1);
    const end = Math.floor(analyserData.length * 0.6);
    const midRange = analyserData.slice(start, end);
    const sum = midRange.reduce((acc, value) => acc + value, 0);
    return midRange.length > 0 ? sum / midRange.length : 0;
  }, [analyserData]);

  const getTrebleFrequency = useCallback(() => {
    if (analyserData.length === 0) return 0;
    
    const trebleRange = analyserData.slice(Math.floor(analyserData.length * 0.6));
    const sum = trebleRange.reduce((acc, value) => acc + value, 0);
    return trebleRange.length > 0 ? sum / trebleRange.length : 0;
  }, [analyserData]);

  const getVisualizerBars = useCallback((barCount = 32) => {
    if (analyserData.length === 0) return new Array(barCount).fill(0);

    const bars = [];
    const samplesPerBar = Math.floor(analyserData.length / barCount);

    for (let i = 0; i < barCount; i++) {
      const start = i * samplesPerBar;
      const end = start + samplesPerBar;
      const slice = analyserData.slice(start, end);
      const average = slice.reduce((sum, value) => sum + value, 0) / slice.length;
      bars.push(average / 255);
    }

    return bars;
  }, [analyserData]);

  const getCircularVisualizerData = useCallback((points = 64) => {
    if (analyserData.length === 0) return new Array(points).fill(0);

    const data = [];
    const samplesPerPoint = Math.floor(analyserData.length / points);

    for (let i = 0; i < points; i++) {
      const start = i * samplesPerPoint;
      const end = start + samplesPerPoint;
      const slice = analyserData.slice(start, end);
      const average = slice.reduce((sum, value) => sum + value, 0) / slice.length;
      data.push(average / 255);
    }

    return data;
  }, [analyserData]);

  const getWaveformData = useCallback(() => {
    if (!analyserRef.current || !dataArrayRef.current) return new Array(128).fill(0);

    const waveformArray = new Uint8Array(analyserRef.current.fftSize);
    analyserRef.current.getByteTimeDomainData(waveformArray);
    
    return Array.from(waveformArray).map(value => (value - 128) / 128);
  }, []);

  const cleanup = useCallback(() => {
    stopVisualizer();
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    analyserRef.current = null;
    sourceRef.current = null;
    dataArrayRef.current = null;
    setIsVisualizerActive(false);
    setAnalyserData(new Uint8Array(0));
  }, [stopVisualizer]);

  useEffect(() => {
    if (audioElement && !audioContextRef.current) {
      initializeVisualizer();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioElement, initializeVisualizer]);

  useEffect(() => {
    if (isPlaying && isVisualizerActive) {
      startVisualizer();
    } else {
      stopVisualizer();
    }
  }, [isPlaying, isVisualizerActive, startVisualizer, stopVisualizer]);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    analyserData,
    isVisualizerActive,
    getFrequencyData,
    getAverageFrequency,
    getBassFrequency,
    getMidFrequency,
    getTrebleFrequency,
    getVisualizerBars,
    getCircularVisualizerData,
    getWaveformData,
    startVisualizer,
    stopVisualizer,
    cleanup
  };
};