'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const AudioVisualizer = ({ 
  audioElement, 
  isPlaying = false, 
  className = '',
  type = 'bars',
  color = 'primary',
  size = 'medium'
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const dataArrayRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const sizeConfig = {
    small: { width: 200, height: 60, barCount: 32 },
    medium: { width: 300, height: 80, barCount: 64 },
    large: { width: 400, height: 120, barCount: 128 }
  };

  const colorConfig = {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#f59e0b',
    success: '#10b981',
    danger: '#ef4444',
    gradient: ['#3b82f6', '#8b5cf6', '#f59e0b']
  };

  const config = sizeConfig[size];
  const visualColor = colorConfig[color];

  useEffect(() => {
    if (!audioElement || isInitialized) return;

    const initializeAudioContext = async () => {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        
        if (!sourceRef.current) {
          sourceRef.current = audioContextRef.current.createMediaElementSource(audioElement);
          sourceRef.current.connect(analyserRef.current);
          analyserRef.current.connect(audioContextRef.current.destination);
        }

        analyserRef.current.fftSize = config.barCount * 2;
        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing audio context:', error);
      }
    };

    initializeAudioContext();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioElement, config.barCount, isInitialized]);

  useEffect(() => {
    if (!isInitialized || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = config.width;
    canvas.height = config.height;

    const draw = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (type === 'bars') {
        drawBars(ctx);
      } else if (type === 'wave') {
        drawWave(ctx);
      } else if (type === 'circle') {
        drawCircle(ctx);
      }

      if (isPlaying) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    if (isPlaying && audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }

    if (isPlaying) {
      draw();
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, isInitialized, type, config]);

  const drawBars = (ctx) => {
    const barWidth = config.width / config.barCount;
    let x = 0;

    for (let i = 0; i < config.barCount; i++) {
      const barHeight = (dataArrayRef.current[i] / 255) * config.height;
      
      if (Array.isArray(visualColor)) {
        const gradient = ctx.createLinearGradient(0, config.height, 0, 0);
        visualColor.forEach((color, index) => {
          gradient.addColorStop(index / (visualColor.length - 1), color);
        });
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = visualColor;
      }

      ctx.fillRect(x, config.height - barHeight, barWidth - 1, barHeight);
      x += barWidth;
    }
  };

  const drawWave = (ctx) => {
    ctx.lineWidth = 2;
    ctx.strokeStyle = Array.isArray(visualColor) ? visualColor[0] : visualColor;
    ctx.beginPath();

    const sliceWidth = config.width / config.barCount;
    let x = 0;

    for (let i = 0; i < config.barCount; i++) {
      const v = dataArrayRef.current[i] / 128.0;
      const y = (v * config.height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.stroke();
  };

  const drawCircle = (ctx) => {
    const centerX = config.width / 2;
    const centerY = config.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.clearRect(0, 0, config.width, config.height);

    for (let i = 0; i < config.barCount; i++) {
      const angle = (i / config.barCount) * Math.PI * 2;
      const barHeight = (dataArrayRef.current[i] / 255) * radius * 0.5;
      
      const x1 = centerX + Math.cos(angle) * (radius - barHeight);
      const y1 = centerY + Math.sin(angle) * (radius - barHeight);
      const x2 = centerX + Math.cos(angle) * radius;
      const y2 = centerY + Math.sin(angle) * radius;

      ctx.strokeStyle = Array.isArray(visualColor) ? visualColor[i % visualColor.length] : visualColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  };

  if (!audioElement) {
    return (
      <div className={`flex items-center justify-center bg-muted rounded-lg ${className}`} 
           style={{ width: config.width, height: config.height }}>
        <p className="text-muted-foreground text-sm">No audio source</p>
      </div>
    );
  }

  return (
    <motion.div
      className={`relative overflow-hidden rounded-lg bg-background/50 backdrop-blur-sm border ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ 
          width: config.width, 
          height: config.height,
          filter: isPlaying ? 'none' : 'grayscale(100%) opacity(50%)'
        }}
      />
      
      {!isPlaying && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-primary/20 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-primary/50" />
            </div>
            <p className="text-xs text-muted-foreground">Paused</p>
          </div>
        </motion.div>
      )}

      <div className="absolute top-2 right-2">
        <motion.div
          className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500' : 'bg-gray-400'}`}
          animate={{ 
            scale: isPlaying ? [1, 1.2, 1] : 1,
            opacity: isPlaying ? [1, 0.7, 1] : 0.5
          }}
          transition={{ 
            duration: 1.5, 
            repeat: isPlaying ? Infinity : 0,
            ease: "easeInOut"
          }}
        />
      </div>
    </motion.div>
  );
};

export default AudioVisualizer;