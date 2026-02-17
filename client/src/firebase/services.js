import { BOOKS } from '../data/books';

// LocalStorage key names for dynamic data
const COMMENTS_KEY = 'mutola_comments';
const RATINGS_KEY = 'mutola_ratings';

// Internal helper to get/set data from localStorage
const getLocalData = (key, defaultValue = []) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
};

const setLocalData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

export const bookService = {
    async getAllBooks() {
        // Books are now static and loaded from frontend folder
        return BOOKS;
    },

    async getBookById(id) {
        return BOOKS.find(b => b.id === id) || null;
    },

    // Administrative functions are now disabled or could be redirected to a manual process
    async addBook(bookData) {
        console.warn('Book addition is now manual. Update src/data/books.js and add the file to public/books/');
        return null;
    },

    async updateBook(id, data) {
        console.warn('Book updates are now manual. Update src/data/books.js');
    },

    async deleteBook(id) {
        console.warn('Book deletion is now manual. Update src/data/books.js');
    }
};

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const commentService = {
    async getComments(bookId) {
        try {
            const response = await fetch(`${BASE_URL}/api/comments/${bookId}`);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error fetching comments:', error);
            return [];
        }
    },

    async addComment(bookId, comment) {
        try {
            const response = await fetch(`${BASE_URL}/api/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookId,
                    ...comment
                }),
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error adding comment:', error);
            return {
                ...comment,
                id: Date.now().toString(),
                bookId,
                createdAt: new Date().toISOString()
            };
        }
    }
};

export const ratingService = {
    async addRating(bookId, rating) {
        // Since books are static, we'll store ratings separately in localStorage
        const allRatings = getLocalData(RATINGS_KEY);
        const newRating = {
            bookId,
            rating,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
        };
        allRatings.push(newRating);
        setLocalData(RATINGS_KEY, allRatings);
        return newRating;
    }
};
