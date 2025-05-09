import express from 'express';
import mustacheExpress from 'mustache-express';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mustache setup
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// SQLite connection
const dbPromise = open({
  filename: './database.db',
  driver: sqlite3.Database
});

// Routes
app.get('/', async (req, res) => {
  const db = await dbPromise;  
  db.all('SELECT * FROM todos', (err, rows) => {
    if (err) return res.status(500).send('DB error');
    res.render('index', { todos: rows });  
  });
});

app.post('/add', async (req, res) => {
  const db = await dbPromise;
  const { task } = req.body;
  await db.run('INSERT INTO todos (task) VALUES (?)', [task]);
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
