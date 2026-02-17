import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import Reader from './pages/Reader';
import Admin from './pages/Admin';
import './App.css';

import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';

const VIDEOS = ['/kitob.mp4', '/kitob2.mp4', '/kitob3.mp4'];

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [videoIndex, setVideoIndex] = useState(0);
  const videoRef = React.useRef(null);
  const bgRef = React.useRef(null);
  const mousePos = React.useRef({ x: 0, y: 0 });
  const currentPos = React.useRef({ x: 0, y: 0 });

  const handleVideoEnd = () => {
    setVideoIndex((prevIndex) => (prevIndex + 1) % VIDEOS.length);
  };

  const handleMouseMove = (e) => {
    mousePos.current = {
      x: (e.clientX - window.innerWidth / 2) / 60,
      y: (e.clientY - window.innerHeight / 2) / 60
    };
  };

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
      videoRef.current.load();
      videoRef.current.play();
    }

    let rafId;
    const animateBg = () => {
      const easing = 0.05;
      currentPos.current.x += (mousePos.current.x - currentPos.current.x) * easing;
      currentPos.current.y += (mousePos.current.y - currentPos.current.y) * easing;

      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0) scale(1.15)`;
      }
      rafId = requestAnimationFrame(animateBg);
    };
    rafId = requestAnimationFrame(animateBg);

    return () => cancelAnimationFrame(rafId);
  }, [videoIndex]);

  return (
    <ThemeProvider>
      <Router>
        <div className="app" onMouseMove={handleMouseMove}>
          <CustomCursor />
          <div ref={bgRef} className="video-background">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              onEnded={handleVideoEnd}
            >
              <source src={VIDEOS[videoIndex]} type="video/mp4" />
            </video>
          </div>
          <Toaster position="top-center" />
          <Navbar onSearch={setSearchQuery} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home searchQuery={searchQuery} />} />
              <Route path="/book/:id" element={<BookDetail />} />
              <Route path="/read/:id" element={<Reader />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
