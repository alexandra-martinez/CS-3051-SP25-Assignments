// server.js

const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve your HTML/CSS/JS from "public" folder

// Load or initialize votes
let votes = {};
const VOTES_FILE = './votes.json';

if (fs.existsSync(VOTES_FILE)) {
  votes = JSON.parse(fs.readFileSync(VOTES_FILE));
} else {
  votes = {
    "Ivonne": 0, "Antonio Sr": 0, "Octavio": 0, "Tayo": 0, "Ale": 0,
    "Pina": 0, "Tonito": 0, "Frida": 0, "Mely": 0, "Vivi": 0, "Vera": 0,
    "Laz": 0, "Mario": 0, "Dwayne": 0, "Vivian": 0, "Ariadna": 0, "Linda": 0
  };
  fs.writeFileSync(VOTES_FILE, JSON.stringify(votes, null, 2));
}

// Routes
app.get('/votes', (req, res) => {
  res.json(votes);
});

app.post('/vote', (req, res) => {
  const { member } = req.body;
  if (votes.hasOwnProperty(member)) {
    votes[member]++;
    fs.writeFileSync(VOTES_FILE, JSON.stringify(votes, null, 2));
    res.json({ success: true, message: `Vote recorded for ${member}` });
  } else {
    res.status(400).json({ success: false, message: 'Invalid member name' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
