import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Moon, Sun, BookOpen, Menu, X, Settings } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const Navbar = ({ onSearch }) => {
    const { isDarkMode, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdminTriggered, setIsAdminTriggered] = useState(false);
    const [typedChars, setTypedChars] = useState('');
    const navigate = useNavigate();

    const [isReadyForAdmin, setIsReadyForAdmin] = useState(false);

    useEffect(() => {
        const handleDoubleClick = () => {
            setIsReadyForAdmin(true);
            setTimeout(() => setIsReadyForAdmin(false), 5000); // 5 seconds to type "adminpp"
        };

        const handleKeyDown = (e) => {
            if (!isReadyForAdmin) return;
            setTypedChars(prev => (prev + e.key).slice(-7));
        };

        window.addEventListener('dblclick', handleDoubleClick);
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('dblclick', handleDoubleClick);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isReadyForAdmin]);

    useEffect(() => {
        if (typedChars === 'adminpp') {
            const password = prompt('Admin parolini kiriting:');
            if (password === '1212') {
                localStorage.setItem('isAdmin', 'true');
                navigate('/admin');
                setTypedChars('');
            } else {
                alert('Noto‘g‘ri parol!');
                setTypedChars('');
            }
        }
    }, [typedChars, navigate]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        onSearch(e.target.value);
    };

    return (
        <nav className="navbar glass pill-shape">
            <div className="container nav-content">
                <Link to="/" className="logo">
                    <img src="/logo.jpg" alt="Mutolaa Logo" className="logo-img" />
                    <span>Mutolaa</span>
                </Link>

                <div className="search-bar glass pill-shape">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Kitob qidirish..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>

                <div className="nav-actions">
                    <button onClick={toggleTheme} className="theme-toggle">
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                    <Link to="/" onClick={() => setIsMenuOpen(false)}>Asosiy</Link>
                    <Link to="/genres" onClick={() => setIsMenuOpen(false)}>Janrlar</Link>
                    {localStorage.getItem('isAdmin') === 'true' && (
                        <Link to="/admin" className="admin-link">
                            <Settings size={18} />
                            Admin
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
