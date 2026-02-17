import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MessageSquare, Download, Play, ArrowLeft, Send } from 'lucide-react';
import { bookService, commentService, ratingService } from '../firebase/services';
import './BookDetail.css';

const BookDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    useEffect(() => {
        fetchBookData();
    }, [id]);

    const fetchBookData = async () => {
        setLoading(true);
        const bookData = await bookService.getBookById(id);
        if (!bookData) {
            navigate('/');
            return;
        }
        setBook(bookData);
        const commentData = await commentService.getComments(id);
        setComments(commentData);
        setLoading(false);
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const comment = {
            text: newComment,
            user: 'Mehmon Foydalanuvchi',
            userAvatar: 'https://i.pravatar.cc/150?u=' + Math.random(),
        };

        const added = await commentService.addComment(id, comment);
        setComments([added, ...comments]);
        setNewComment('');
    };

    const handleRating = async (rating) => {
        setUserRating(rating);
        await ratingService.addRating(id, rating);
        fetchBookData(); // Refresh to show new average
    };

    if (loading) return <div className="loading-container"><div className="loader"></div></div>;

    return (
        <div className="book-detail-page container fade-in">
            <button className="back-btn" onClick={() => navigate(-1)}>
                <ArrowLeft size={20} /> Orqaga
            </button>

            <div className="detail-layout">
                <aside className="detail-sidebar">
                    <div className="detail-cover-wrapper">
                        <img src={book.coverUrl || 'https://images.unsplash.com/photo-1543005158-447702f5041c?auto=format&fit=crop&q=80&w=400'} alt={book.title} />
                    </div>
                    <div className="detail-actions">
                        <button className="btn-primary btn-pill full-width" onClick={() => navigate(`/read/${id}`)}>
                            <Play size={20} /> Hozir o'qish
                        </button>
                        <a
                            href={book.bookUrl}
                            download
                            className="btn-secondary btn-pill full-width"
                        >
                            <Download size={20} /> Yuklab olish (PDF)
                        </a>
                    </div>
                </aside>

                <main className="detail-main">
                    <div className="detail-info">
                        <span className="detail-genre">{book.genre}</span>
                        <h1>{book.title}</h1>
                        <p className="detail-author">Muallif: <span>{book.author}</span></p>

                        <div className="detail-stats">
                            <div className="detail-stat">
                                <Star className="star-icon" fill="#fbbf24" color="#fbbf24" />
                                <div>
                                    <strong>{book.rating?.toFixed(1) || '0.0'}</strong>
                                    <span>Reyting</span>
                                </div>
                            </div>
                            <div className="detail-stat">
                                <MessageSquare className="msg-icon" />
                                <div>
                                    <strong>{book.reviewsCount || 0}</strong>
                                    <span>Izohlar</span>
                                </div>
                            </div>
                        </div>

                        <div className="detail-description">
                            <h3>Tavsif</h3>
                            <p>{book.description || 'Ushbu kitob haqida ma\'lumot berilmagan.'}</p>
                        </div>

                        <div className="detail-rating-section">
                            <h3>Baholash</h3>
                            <div className="star-rating">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => handleRating(star)}
                                        className={(hoverRating || userRating) >= star ? 'active' : ''}
                                    >
                                        <Star fill={(hoverRating || userRating) >= star ? 'currentColor' : 'none'} />
                                    </button>
                                ))}
                            </div>
                            <p>Sizning bahoingiz: {userRating ? `${userRating} yulduz` : 'Hali baholamadingiz'}</p>
                        </div>

                        <section className="comments-section">
                            <h3>Izohlar ({comments.length})</h3>
                            <form className="comment-form" onSubmit={handleAddComment}>
                                <textarea
                                    placeholder="Fikringizni qoldiring..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                ></textarea>
                                <button type="submit" className="btn-primary btn-pill" disabled={!newComment.trim()}>
                                    <Send size={18} /> Yuborish
                                </button>
                            </form>

                            <div className="comments-list">
                                {comments.length > 0 ? (
                                    comments.map(comment => (
                                        <div key={comment.id} className="comment-item">
                                            <img src={comment.userAvatar} alt={comment.user} className="user-avatar" />
                                            <div className="comment-content">
                                                <div className="comment-header">
                                                    <strong>{comment.user}</strong>
                                                    <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <p>{comment.text}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-comments">Hali izohlar mavjud emas. Birinchi bo'lib yozing!</p>
                                )}
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default BookDetail;
