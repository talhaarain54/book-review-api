const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const DATA_PATH = path.join(__dirname, 'data', 'books.json');
const SECRET = process.env.JWT_SECRET || 'secret123';

// Simple in-memory users store (for lab). In production use DB.
const users = [];

// Helper: read/write books file
function readBooks() {
  const content = fs.readFileSync(DATA_PATH, 'utf8');
  return JSON.parse(content);
}
function writeBooks(books) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(books, null, 2));
}

// Public routes
app.get('/books', (req, res) => {
  const books = readBooks();
  res.json(books);
});

app.get('/books/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;
  const books = readBooks();
  const book = books.find(b => b.isbn === isbn);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
});

app.get('/books/author/:author', (req, res) => {
  const { author } = req.params;
  const books = readBooks();
  const found = books.filter(b => b.author.toLowerCase() === author.toLowerCase());
  res.json(found);
});

app.get('/books/title/:title', (req, res) => {
  const { title } = req.params;
  const books = readBooks();
  const found = books.filter(b => b.title.toLowerCase().includes(title.toLowerCase()));
  res.json(found);
});

app.get('/books/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const books = readBooks();
  const book = books.find(b => b.isbn === isbn);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book.reviews || {});
});

// Auth: register/login
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });
  if (users.find(u => u.username === username)) return res.status(409).json({ message: 'User exists' });
  users.push({ username, password });
  res.json({ message: 'User registered successfully' });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
  res.json({ message: 'Login successful', token });
});

// Auth middleware
function authenticate(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ message: 'Missing Authorization header' });
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ message: 'Invalid Authorization format' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, SECRET);
    req.user = payload; // { username }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// Registered user endpoints
app.put('/books/review/:isbn', authenticate, (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body; // { review: 'text' }
  if (!review) return res.status(400).json({ message: 'Review text required' });
  const books = readBooks();
  const book = books.find(b => b.isbn === isbn);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  book.reviews = book.reviews || {};
  book.reviews[req.user.username] = review;
  writeBooks(books);
  res.json({ message: 'Review added/updated', reviews: book.reviews });
});

app.delete('/books/review/:isbn', authenticate, (req, res) => {
  const { isbn } = req.params;
  const books = readBooks();
  const book = books.find(b => b.isbn === isbn);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  if (!book.reviews || !book.reviews[req.user.username]) return res.status(404).json({ message: 'Your review not found' });
  delete book.reviews[req.user.username];
  writeBooks(books);
  res.json({ message: 'Review deleted', reviews: book.reviews });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Endpoints: GET /books, /books/isbn/:isbn, /books/author/:author, /books/title/:title, /books/review/:isbn');
});
