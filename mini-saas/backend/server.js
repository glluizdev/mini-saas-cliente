const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./database.db');

// 🔥 CRIA TABELA AUTOMATICAMENTE
db.run(`
CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    company TEXT,
    phone TEXT,
    service TEXT,
    value REAL,
    status TEXT
)
`);

// GET
app.get('/clients', (req, res) => {
    db.all('SELECT * FROM clients', [], (err, rows) => {
        res.json(rows);
    });
});

// POST
app.post('/clients', (req, res) => {
    const { name, company, phone, service, value, status } = req.body;

    db.run(
        `INSERT INTO clients (name, company, phone, service, value, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name, company, phone, service, value, status]
    );

    res.json({ message: "Cliente criado!" });
});

// DELETE
app.delete('/clients/:id', (req, res) => {
    db.run(
        'DELETE FROM clients WHERE id = ?',
        [req.params.id]
    );
    res.json({ message: "Cliente deletado!" });
});

// PUT
app.put('/clients/:id', (req, res) => {
    const { id } = req.params;
    const { name, value, status } = req.body;
    db.run(
        `UPDATE clients 
         SET name = ?, value = ?, status = ? 
         WHERE id = ?`,
        [name, value, status, id],
        function(err){
            if(err){
                return res.status(500).json(err);
            }
            res.json({ message: 'Cliente atualizado!' });
        }
    );
});

// SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});