const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('./db.sqlite');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Create table if not exists
db.run(`CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task TEXT NOT NULL,
    completed INTEGER DEFAULT 0
)`);

// Get all todos
app.get('/todos', (req, res) => {
    db.all("SELECT * FROM todos", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Add new todo
app.post('/todos', (req, res) => {
    const { task } = req.body;
    db.run("INSERT INTO todos (task) VALUES (?)", [task], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, task, completed: 0 });
    });
});

// Delete a todo
app.delete('/todos/:id', (req, res) => {
    db.run("DELETE FROM todos WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.sendStatus(200);
    });
});

// Toggle complete
app.put('/todos/:id', (req, res) => {
    const { completed } = req.body;
    db.run("UPDATE todos SET completed = ? WHERE id = ?", [completed ? 1 : 0, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.sendStatus(200);
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
});
