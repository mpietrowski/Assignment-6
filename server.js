// Michael Pietrowski - Assignment 6

// Express and sqlite3 packages
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

// Sets up the app and connects to the database
const app = express();
const db = new sqlite3.Database('./database/demographics.db');

// Lets the server read JSON data from requests
app.use(express.json());

// HTML files from the public folder
app.use(express.static('public'));

// Creates the demographics table if it does not exist
db.run(`
  CREATE TABLE IF NOT EXISTS demographics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT,
    lastName TEXT,
    age INTEGER,
    email TEXT,
    gender TEXT,
    city TEXT
  )
`);

// POST endpoint - Adds a new record to the database
app.post('/api/demographics', (req, res) => {
  const { firstName, lastName, age, email, gender, city } = req.body;
  const query = `INSERT INTO demographics (firstName, lastName, age, email, gender, city) VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(query, [firstName, lastName, age, email, gender, city], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// GET endpoint - Pulls all the records from the database
app.get('/api/demographics', (req, res) => {
  db.all('SELECT * FROM demographics', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// PUT endpoint - Updates an existing record by its id
app.put('/api/demographics/:id', (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, age, email, gender, city } = req.body;
  const query = `
    UPDATE demographics SET firstName = ?, lastName = ?, age = ?, email = ?, gender = ?, city = ?
    WHERE id = ?
  `;
  db.run(query, [firstName, lastName, age, email, gender, city, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Record updated successfully' });
  });
});

// DELETE endpoint - Removes a record from the database by its id
app.delete('/api/demographics/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM demographics WHERE id = ?', id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Record deleted successfully' });
  });
});

// Starts the server on port 3000
app.listen(3000, () => {
  console.log('Running on port 3000');
});