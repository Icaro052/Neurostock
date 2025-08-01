const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('inventoro.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    points INTEGER DEFAULT 0
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL
  )`);
});

module.exports = db;
