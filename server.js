const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Home route -> serve home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html')); // or index.html if that's your homepage
});

// Optional API route or voting logic...

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
