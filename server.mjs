import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to get a random image
app.get('/random-image', (req, res) => {
  const images = ['img1.jpg', 'img2.jpg']; // Add more images as needed
  const randomImage = images[Math.floor(Math.random() * images.length)];
  res.send(`/images/${randomImage}`);
});

// Endpoint to serve HTML snippets
app.get('/snippet/:name', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'snippets', `${req.params.name}.html`);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(404).send('Snippet not found');
    res.send(data);
  });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
