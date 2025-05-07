const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const votesFile = path.join(__dirname, 'public', 'votes.json');
const usersFile = path.join(__dirname, 'public', 'users.json');
console.log('Resolved users.json path:', usersFile);
// Serve homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Get current votes
app.get('/votes', (req, res) => {
  fs.readFile(votesFile, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Could not load votes' });
    res.json(JSON.parse(data));
  });
});

// Cast a vote (requires username and member)
app.post('/vote', (req, res) => {
  const { username, member } = req.body;

  console.log('Vote received:', { username, member }); // Debugging

  // Validate input
  if (!username || !member) {
    console.error('Validation failed: Missing username or member');
    return res.status(400).json({ error: 'Username and member are required.' });
  }

  // Read the users.json file
  fs.readFile(usersFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading users.json:', err);
      return res.status(500).json({ error: 'Failed to read users file.' });
    }

    let users;
    try {
      users = JSON.parse(data);
    } catch (parseErr) {
      console.error('Error parsing users.json:', parseErr);
      return res.status(500).json({ error: 'Invalid JSON in users file.' });
    }

    // Check if the user exists
    if (!users[username]) {
      console.error('User not found:', username);
      return res.status(404).json({ error: 'User not found.' });
    }

    // Update the user's votes
    if (!users[username].votes[member]) {
      users[username].votes[member] = 0;
    }
    users[username].votes[member]++;

    console.log('Updated votes:', users[username].votes); // Debugging

    // Write the updated data back to users.json
    fs.writeFile(usersFile, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        console.error('Error writing to users.json:', err);
        return res.status(500).json({ error: 'Failed to save vote.' });
      }

      console.log(`Vote saved: ${username} -> ${member}`);
      res.json({ success: true, message: `Vote recorded for ${member}.` });
    });
  });
});

// Login or Register user
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });

  fs.readFile(usersFile, 'utf8', (err, data) => {
    let users = err ? {} : JSON.parse(data);

    if (!users[username]) {
      users[username] = { password, votes: {} }; // Register new user
    } else if (users[username].password !== password) {
      return res.status(403).json({ error: 'Incorrect password' });
    }

    fs.writeFile(usersFile, JSON.stringify(users, null, 2), () => {
      res.json({ success: true });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
