import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, X, PlusCircle, LayoutDashboard, BookOpen, LogOut } from 'lucide-react';
import { bookService } from '../firebase/services';
import './Admin.css';

const Admin = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        genre: 'Badiiy',
        description: '',
        coverUrl: '',
        bookUrl: '',
    });

    useEffect(() => {
        if (localStorage.getItem('isAdmin') !== 'true') {
            navigate('/');
        }
        fetchBooks();
    }, [navigate]);

    const fetchBooks = async () => {
        const data = await bookService.getAllBooks();
        setBooks(data);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingBook) {
            await bookService.updateBook(editingBook.id, formData);
        } else {
            await bookService.addBook(formData);
        }
        setShowModal(false);
        setEditingBook(null);
        setFormData({ title: '', author: '', genre: 'Badiiy', description: '', coverUrl: '', bookUrl: '' });
        fetchBooks();
    };

    const handleEdit = (book) => {
        setEditingBook(book);
        setFormData({
            title: book.title,
            author: book.author,
            genre: book.genre,
            description: book.description,
            coverUrl: book.coverUrl,
            bookUrl: book.bookUrl,
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Haqiqatdan ham o‘chirmoqchimisiz?')) {
            await bookService.deleteBook(id);
            fetchBooks();
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('isAdmin');
        navigate('/');
    };

    return (
        <div className="admin-page container fade-in">
            <header className="admin-header">
                <div className="admin-title">
                    <LayoutDashboard size={28} />
                    <h1>Admin Panel</h1>
                </div>
                <div className="header-actions">
                    <button className="btn-primary" onClick={() => { setShowModal(true); setEditingBook(null); }}>
                        <Plus size={20} /> Yangi Kitob
                    </button>
                    <button className="btn-logout" onClick={handleLogout}>
                        <LogOut size={20} /> Chiqish
                    </button>
                </div>
            </header>

            <div className="admin-stats-grid">
                <div className="admin-stat-card glass">
                    <BookOpen size={24} />
                    <div>
                        <h3>{books.length}</h3>
                        <span>Jami Kitoblar</span>
                    </div>
                </div>
            </div>

            <div className="books-table-container glass">
                <table className="books-table">
                    <thead>
                        <tr>
                            <th>Muqova</th>
                            <th>Nomi</th>
                            <th>Muallif</th>
                            <th>Janr</th>
                            <th>Amallar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map(book => (
                            <tr key={book.id}>
                                <td>
                                    <img src={book.coverUrl || 'https://via.placeholder.com/40x60'} alt={book.title} className="table-thumb" />
                                </td>
                                <td><strong>{book.title}</strong></td>
                                <td>{book.author}</td>
                                <td><span className="table-badge">{book.genre}</span></td>
                                <td>
                                    <div className="table-actions">
                                        <button className="action-btn edit" onClick={() => handleEdit(book)}>
                                            <Edit size={18} />
                                        </button>
                                        <button className="action-btn delete" onClick={() => handleDelete(book.id)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content glass fade-in">
                        <div className="modal-header">
                            <h2>{editingBook ? 'Kitobni tahrirlash' : 'Yangi kitob qo‘shish'}</h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="form-group">
                                <label>Kitob nomi</label>
                                <input name="title" value={formData.title} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Muallif</label>
                                <input name="author" value={formData.author} onChange={handleChange} required />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Janr</label>
                                    <select name="genre" value={formData.genre} onChange={handleChange}>
                                        <option value="Badiiy">Badiiy</option>
                                        <option value="Ilmiy">Ilmiy</option>
                                        <option value="Biznes">Biznes</option>
                                        <option value="Psixologiya">Psixologiya</option>
                                        <option value="Tarix">Tarix</option>
                                        <option value="Detektiv">Detektiv</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Tavsif</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} required></textarea>
                            </div>
                            <div className="form-group">
                                <label>Muqova rasm URL (yoki upload uchun joy)</label>
                                <input name="coverUrl" value={formData.coverUrl} onChange={handleChange} placeholder="https://..." />
                            </div>
                            <div className="form-group">
                                <label>Kitob fayli URL (PDF/EPUB)</label>
                                <input name="bookUrl" value={formData.bookUrl} onChange={handleChange} placeholder="https://..." />
                            </div>
                            <button type="submit" className="btn-primary full-width">
                                {editingBook ? 'Saqlash' : 'Qo‘shish'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
