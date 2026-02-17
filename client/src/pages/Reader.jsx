import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Settings, Maximize, Minus, Plus } from 'lucide-react';
import { bookService } from '../firebase/services';
import './Reader.css';

const Reader = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const fetchBook = async () => {
            const data = await bookService.getBookById(id);
            setBook(data);
        };
        fetchBook();
    }, [id]);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    if (!book) return <div className="loading">Yuklanmoqda...</div>;

    return (
        <div className={`reader-page ${isFullscreen ? 'fullscreen' : ''}`}>
            <nav className="reader-nav glass">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                </button>
                <div className="reader-title">
                    <h3>{book.title}</h3>
                    <span>{book.author}</span>
                </div>
                <div className="reader-controls">
                    <button onClick={toggleFullscreen} title="To'liq ekran">
                        <Maximize size={20} />
                    </button>
                    <a href={book.bookUrl} download className="btn-download" title="Yuklab olish">
                        Yuklab olish (PDF)
                    </a>
                </div>
            </nav>

            <main className="reader-content">
                <div className="pdf-container glass fade-in">
                    {book.bookUrl ? (
                        <iframe
                            src={`${book.bookUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                            title={book.title}
                            width="100%"
                            height="100%"
                            className="pdf-viewer"
                        ></iframe>
                    ) : (
                        <div className="error-msg">Kitob fayli topilmadi.</div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Reader;
