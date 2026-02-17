const API_URL = import.meta.env.VITE_API_URL;

export const bookService = {
    async getAllBooks() {
        try {
            const resp = await fetch(`${API_URL}/books`);
            return await resp.json();
        } catch (error) {
            console.error("Error fetching books:", error);
            return [];
        }
    },

    async getBookById(id) {
        try {
            const resp = await fetch(`${API_URL}/books/${id}`);
            if (!resp.ok) return null;
            return await resp.json();
        } catch (error) {
            console.error("Error fetching book:", error);
            return null;
        }
    },

    async addBook(bookData) {
        try {
            const resp = await fetch(`${API_URL}/books`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookData)
            });
            return await resp.json();
        } catch (error) {
            console.error("Error adding book:", error);
        }
    },

    async updateBook(id, data) {
        try {
            await fetch(`${API_URL}/books/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } catch (error) {
            console.error("Error updating book:", error);
        }
    },

    async deleteBook(id) {
        try {
            await fetch(`${API_URL}/books/${id}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error("Error deleting book:", error);
        }
    }
};

export const commentService = {
    async getComments(bookId) {
        try {
            const resp = await fetch(`${API_URL}/books/${bookId}/comments`);
            return await resp.json();
        } catch (error) {
            console.error("Error fetching comments:", error);
            return [];
        }
    },

    async addComment(bookId, comment) {
        try {
            const resp = await fetch(`${API_URL}/books/${bookId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(comment)
            });
            return await resp.json();
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    }
};

export const ratingService = {
    async addRating(bookId, rating) {
        try {
            const resp = await fetch(`${API_URL}/books/${bookId}/ratings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating })
            });
            return await resp.json();
        } catch (error) {
            console.error("Error adding rating:", error);
        }
    }
};
