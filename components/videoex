import React, { useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';

export default function VideoExamplePage() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [isMuted, setIsMuted] = React.useState(true); // Start muted for autoplay
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const updateTime = () => setCurrentTime(video.currentTime);
      const updateDuration = () => setDuration(video.duration);
      
      video.addEventListener('timeupdate', updateTime);
      video.addEventListener('loadedmetadata', updateDuration);
      
      return () => {
        video.removeEventListener('timeupdate', updateTime);
        video.removeEventListener('loadedmetadata', updateDuration);
      };
    }
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      setIsMuted(video.muted);
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    
    if (video) {
      video.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (video) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
      }
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section with Video */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        
        {/* Video Container */}
        <div className="relative z-20 w-full max-w-6xl mx-auto px-4">
          <div className="relative group">
            <video
              ref={videoRef}
              className="w-full h-auto rounded-2xl shadow-2xl"
              autoPlay
              muted={isMuted}
              loop
              playsInline
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source 
                src="https://7vfknjtmqkepip1x.public.blob.vercel-storage.com/bts.mp4" 
                type="video/mp4" 
              />
              Your browser does not support the video tag.
            </video>
            
            {/* Custom Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="p-6">
                {/* Progress Bar */}
                <div 
                  className="w-full h-2 bg-white/20 rounded-full cursor-pointer mb-4"
                  onClick={handleSeek}
                >
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-purple-500 rounded-full transition-all duration-100"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  ></div>
                </div>
                
                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={togglePlay}
                      className="bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 text-white" />
                      ) : (
                        <Play className="w-6 h-6 text-white ml-1" />
                      )}
                    </button>
                    
                    <button
                      onClick={toggleMute}
                      className="bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors"
                    >
                      {isMuted ? (
                        <VolumeX className="w-6 h-6 text-white" />
                      ) : (
                        <Volume2 className="w-6 h-6 text-white" />
                      )}
                    </button>
                    
                    <span className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                  
                  <button
                    onClick={toggleFullscreen}
                    className="bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors"
                  >
                    <Maximize2 className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Video Title/Description */}
          <div className="text-center mt-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-green-400 to-purple-500 bg-clip-text text-transparent">
                Behind The Scenes
              </span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Experience the magic behind the creation. This video showcases the incredible journey 
              and dedication that goes into every project.
            </p>
          </div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-green-400/10 to-transparent rounded-full animate-pulse"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-500/10 to-transparent rounded-full animate-pulse delay-1000"></div>
        </div>
      </div>
      
      {/* Additional Content Section */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            More About This Video
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <h3 className="text-xl font-semibold text-white mb-4">Technical Details</h3>
              <p className="text-white/80">
                This video features high-quality production with professional lighting and cinematography. 
                The content showcases real behind-the-scenes moments captured during production.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <h3 className="text-xl font-semibold text-white mb-4">Interactive Features</h3>
              <p className="text-white/80">
                The video player includes custom controls with smooth animations, progress tracking, 
                and full-screen capabilities for an enhanced viewing experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
