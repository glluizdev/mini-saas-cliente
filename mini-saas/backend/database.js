const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.log('Erro ao conectar banco');
    } else {
        console.log('Banco conectado');
    }
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS clients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            company TEXT,
            phone TEXT,
            service TEXT,
            value REAL,
            created_at DATETIME DEFAULT (datetime('now', '-3 hours'))
        )
    `);
});

module.exports = db;