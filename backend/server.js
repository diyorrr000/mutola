require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('Mutolaa JSON API ishlamoqda...');
});

app.listen(PORT, () => {
    console.log(`Server ${PORT}-portda ishlamoqda (JSON DB)`);
});
