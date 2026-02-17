import React, { useState, useEffect } from 'react';
import { bookService } from '../firebase/services';
import BookCard from '../components/BookCard';
import { Filter, Bookmark } from 'lucide-react';
import './Home.css';

const GENRES = ['Hammasi', 'Badiiy', 'Ilmiy', 'Biznes', 'Psixologiya', 'Tarix', 'Detektiv'];

const Home = ({ searchQuery }) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGenre, setSelectedGenre] = useState('Hammasi');

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        setLoading(true);
        const data = await bookService.getAllBooks();
        setBooks(data);
        setLoading(false);
    };

    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGenre = selectedGenre === 'Hammasi' || book.genre === selectedGenre;
        return matchesSearch && matchesGenre;
    });

    return (
        <div className="home-page container">
            <header className="hero fade-in">
                <div className="hero-content">
                    <h1>Dunyo bo'ylab bilimlar <span className="gradient-text">Mutolaa</span> orqali</h1>
                    <p>Yuzlab bepul va premium e-kitoblar to'plami. Istalgan vaqtda, istalgan joyda o'qing.</p>
                    <div className="hero-buttons">
                        <button className="btn-primary">Hozir o'qish</button>
                        <button className="btn-secondary">Ma'lumotlar</button>
                    </div>
                </div>
                <div className="hero-stats glass">
                    <div className="stat-item">
                        <h3>1,000+</h3>
                        <span>Kitoblar</span>
                    </div>
                    <div className="stat-item">
                        <h3>50k+</h3>
                        <span>O'quvchilar</span>
                    </div>
                    <div className="stat-item">
                        <h3>4.8</h3>
                        <span>Reyting</span>
                    </div>
                </div>
            </header>

            <section className="catalog-section">
                <div className="catalog-header">
                    <h2>Kitoblar Katalogi</h2>
                    <div className="genres-filter">
                        {GENRES.map(genre => (
                            <button
                                key={genre}
                                className={`genre-btn ${selectedGenre === genre ? 'active' : ''}`}
                                onClick={() => setSelectedGenre(genre)}
                            >
                                {genre}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="loading-grid">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="skeleton-card"></div>)}
                    </div>
                ) : filteredBooks.length > 0 ? (
                    <div className="book-grid">
                        {filteredBooks.map(book => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                ) : (
                    <div className="no-results">
                        <Bookmark size={48} className="no-results-icon" />
                        <p>Hech qanday kitob topilmadi.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
