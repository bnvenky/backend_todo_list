const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');


db.serialize(() => {
  // Create Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )`);

  // Create Todos table
  db.run(`CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task TEXT,
    done INTEGER DEFAULT 0
  )`);
});

module.exports = db;
