const express = require('express');
const path = require('path');

const app = express();
const PORT = 8080;

// Serve static files
app.use(express.static('.'));

// Set correct MIME type for JavaScript modules
app.get('*.js', (req, res, next) => {
    res.type('application/javascript');
    next();
});

// Fallback to index.html for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`ChessTropia running at http://localhost:${PORT}`);
});