import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Settings, Maximize, Minus, Plus } from 'lucide-react';
import { bookService } from '../firebase/services';
import './Reader.css';

const Reader = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [fontSize, setFontSize] = useState(18);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchBook = async () => {
            const data = await bookService.getBookById(id);
            setBook(data);
        };
        fetchBook();
    }, [id]);

    if (!book) return <div className="loading">Yuklanmoqda...</div>;

    return (
        <div className="reader-page">
            <nav className="reader-nav glass">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                </button>
                <div className="reader-title">
                    <h3>{book.title}</h3>
                    <span>{book.author}</span>
                </div>
                <div className="reader-controls">
                    <button onClick={() => setFontSize(prev => Math.max(12, prev - 2))}><Minus size={18} /></button>
                    <span>{fontSize}px</span>
                    <button onClick={() => setFontSize(prev => Math.min(32, prev + 2))}><Plus size={18} /></button>
                    <button><Settings size={20} /></button>
                    <button><Maximize size={20} /></button>
                </div>
            </nav>

            <main className="reader-content container">
                <div className="book-page glass fade-in" style={{ fontSize: `${fontSize}px` }}>
                    <h2>{book.title}</h2>
                    <p>Ushbu kitob hozirda o'qish uchun tayyorlanmoqda. Bu demo interfeys hisoblanadi.</p>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p>
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <div className="page-number">Sahifa {page}</div>
                </div>
            </main>

            <footer className="reader-footer glass">
                <button onClick={() => setPage(prev => Math.max(1, prev - 1))} disabled={page === 1}>
                    <ChevronLeft size={24} /> Oldingi
                </button>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(page / 10) * 100}%` }}></div>
                </div>
                <button onClick={() => setPage(prev => prev + 1)}>
                    Keyingi <ChevronRight size={24} />
                </button>
            </footer>
        </div>
    );
};

export default Reader;
