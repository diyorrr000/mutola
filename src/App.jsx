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

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <Toaster position="top-center" />
          <Navbar onSearch={setSearchQuery} />
          <Routes>
            <Route path="/" element={<Home searchQuery={searchQuery} />} />
            <Route path="/book/:id" element={<BookDetail />} />
            <Route path="/read/:id" element={<Reader />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
