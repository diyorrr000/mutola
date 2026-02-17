import express from 'express';
import cors from 'cors';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const COMMENTS_FILE = path.join(__dirname, 'data', 'comments.json');

app.use(cors());
app.use(express.json());

// Ensure data directory and file exist
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}
if (!fs.existsSync(COMMENTS_FILE)) {
    fs.writeJsonSync(COMMENTS_FILE, []);
}

// Routes
app.get('/api/comments/:bookId', async (req, res) => {
    try {
        const { bookId } = req.params;
        const comments = await fs.readJson(COMMENTS_FILE);
        const bookComments = comments.filter(c => c.bookId === bookId);
        res.json(bookComments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

app.post('/api/comments', async (req, res) => {
    try {
        const { bookId, text, user, userAvatar } = req.body;
        if (!bookId || !text) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const comments = await fs.readJson(COMMENTS_FILE);
        const newComment = {
            id: Date.now().toString(),
            bookId,
            text,
            user: user || 'Mehmon',
            userAvatar: userAvatar || 'https://i.pravatar.cc/150',
            createdAt: new Date().toISOString()
        };

        comments.push(newComment);
        await fs.writeJson(COMMENTS_FILE, comments);
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save comment' });
    }
});

const STATS_FILE = path.join(__dirname, 'data', 'stats.json');

if (!fs.existsSync(STATS_FILE)) {
    fs.writeJsonSync(STATS_FILE, { totalVisits: 50000 }); // Starting with a high base as requested
}

// Stats Routes
app.get('/api/stats', async (req, res) => {
    try {
        const stats = await fs.readJson(STATS_FILE);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

app.post('/api/visit', async (req, res) => {
    try {
        const stats = await fs.readJson(STATS_FILE);
        stats.totalVisits += 1;
        await fs.writeJson(STATS_FILE, stats);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update visits' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
