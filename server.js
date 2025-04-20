require('dotenv').config();                         // yha change

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const db = require('./db');

const app = express();
// const port = 3000;                              // yha change
const port = process.env.PORT || 3000;             // yha bhi


// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/register.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

// API Endpoints
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
    if (err) return res.status(500).send('User already exists or DB error');
    res.send('Registered successfully');
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
    if (results.length > 0) {
      req.session.user = results[0];
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
});

app.get('/check-auth', (req, res) => {
  if (req.session.user) res.json({ loggedIn: true, username: req.session.user.username });
  else res.json({ loggedIn: false });
});

app.post('/add-expense', (req, res) => {
  if (!req.session.user) return res.status(401).send('Unauthorized');
  const { amount, category } = req.body;
  const userId = req.session.user.id;
  db.query('INSERT INTO expenses (user_id, amount, category) VALUES (?, ?, ?)', [userId, amount, category], (err) => {
    if (err) return res.status(500).send('DB error');
    res.send('Expense added');
  });
});

app.get('/expenses', (req, res) => {
  if (!req.session.user) return res.status(401).send('Unauthorized');
  db.query('SELECT * FROM expenses WHERE user_id = ?', [req.session.user.id], (err, results) => {
    res.json(results);
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.send('Logged out');
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
