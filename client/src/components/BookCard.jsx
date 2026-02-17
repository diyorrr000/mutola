import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import './BookCard.css';

const BookCard = ({ book }) => {
    return (
        <Link to={`/book/${book.id}`} className="book-card fade-in">
            <div className="book-cover-container">
                <img
                    src={book.coverUrl || 'https://images.unsplash.com/photo-1543005158-447702f5041c?auto=format&fit=crop&q=80&w=400'}
                    alt={book.title}
                    className="book-cover"
                />
                <div className="book-badge">{book.genre}</div>
            </div>
            <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">{book.author}</p>
                <div className="book-meta">
                    <div className="book-rating">
                        <Star size={14} fill="currentColor" />
                        <span>{book.rating?.toFixed(1) || '0.0'}</span>
                    </div>
                    <span className="book-reviews">({book.reviewsCount || 0} izoh)</span>
                </div>
            </div>
        </Link>
    );
};

export default BookCard;
