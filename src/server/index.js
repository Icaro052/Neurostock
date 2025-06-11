const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const db = require('./database');
const { authenticateToken } = require('./auth');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = 'sua-chave-secreta'; // Substitua por uma chave segura em produção

// Rotas públicas
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') { // Simulação, use banco de dados em produção
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Credenciais inválidas' });
  }
});

// Rotas protegidas
app.get('/api/employees', authenticateToken, (req, res) => {
  db.all('SELECT * FROM employees', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/employees', authenticateToken, (req, res) => {
  const { name, role, points } = req.body;
  db.run('INSERT INTO employees (name, role, points) VALUES (?, ?, ?)', [name, role, points || 0], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, role, points: points || 0 });
  });
});

app.patch('/api/employees/:id/points', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { points } = req.body;
  db.run('UPDATE employees SET points = points + ? WHERE id = ?', [points, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    db.get('SELECT * FROM employees WHERE id = ?', [id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(row);
    });
  });
});

app.get('/api/products', authenticateToken, (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/products', authenticateToken, (req, res) => {
  const { name, quantity, category, price } = req.body;
  db.run('INSERT INTO products (name, quantity, category, price) VALUES (?, ?, ?, ?)', [name, quantity, category, price], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, quantity, category, price });
  });
});

app.get('/api/reports/stock', authenticateToken, (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ report: rows, generatedAt: new Date().toISOString() });
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
