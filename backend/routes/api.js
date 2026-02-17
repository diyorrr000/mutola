const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data.json');

// Helper functions
const readData = async () => {
    const data = await fs.readJson(DATA_FILE);
    return data;
};

const saveData = async (data) => {
    await fs.writeJson(DATA_FILE, data, { spaces: 2 });
};

// BOOKS
router.get('/books', async (req, res) => {
    try {
        const data = await readData();
        res.json(data.books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/books/:id', async (req, res) => {
    try {
        const data = await readData();
        const book = data.books.find(b => b.id === req.params.id);
        if (!book) return res.status(404).json({ message: 'Kitob topilmadi' });
        res.json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/books', async (req, res) => {
    try {
        const data = await readData();
        const newBook = {
            ...req.body,
            id: Date.now().toString(),
            rating: req.body.rating || 0,
            reviewsCount: req.body.reviewsCount || 0,
            createdAt: new Date().toISOString()
        };
        data.books.push(newBook);
        await saveData(data);
        res.status(201).json(newBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/books/:id', async (req, res) => {
    try {
        const data = await readData();
        const index = data.books.findIndex(b => b.id === req.params.id);
        if (index === -1) return res.status(404).json({ message: 'Kitob topilmadi' });

        data.books[index] = { ...data.books[index], ...req.body };
        await saveData(data);
        res.json(data.books[index]);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/books/:id', async (req, res) => {
    try {
        const data = await readData();
        data.books = data.books.filter(b => b.id !== req.params.id);
        await saveData(data);
        res.json({ message: 'Kitob o‘chirildi' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// COMMENTS
router.get('/books/:id/comments', async (req, res) => {
    try {
        const data = await readData();
        const comments = data.comments.filter(c => c.bookId === req.params.id);
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/books/:id/comments', async (req, res) => {
    try {
        const data = await readData();
        const newComment = {
            ...req.body,
            id: Date.now().toString(),
            bookId: req.params.id,
            createdAt: new Date().toISOString()
        };
        data.comments.push(newComment);
        await saveData(data);
        res.status(201).json(newComment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// RATINGS
router.post('/books/:id/ratings', async (req, res) => {
    try {
        const data = await readData();
        const index = data.books.findIndex(b => b.id === req.params.id);
        if (index === -1) return res.status(404).json({ message: 'Kitob topilmadi' });

        const book = data.books[index];
        const newRating = req.body.rating;
        const totalRating = (book.rating * book.reviewsCount) + newRating;
        book.reviewsCount += 1;
        book.rating = totalRating / book.reviewsCount;

        await saveData(data);
        res.json(book);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
