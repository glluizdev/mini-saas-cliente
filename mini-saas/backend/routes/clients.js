const express = require('express');
const router = express.Router();
const db = require('../database');


// LISTAR CLIENTES
router.get('/', (req, res) => {
    db.all('SELECT * FROM clients', [], (err, rows) => {

        if(err){
            return res.status(500).json(err);
        }

        res.json(rows);
    });
});

// CADASTRAR CLIENTE
router.post('/', (req, res) => {
    const { name, company, phone, service, value } = req.body;
    db.run(
        `
            INSERT INTO clients
            (name, company, phone, service, value)

            VALUES (?, ?, ?, ?, ?)
        `,
        [name, company, phone, service, value],

        function(err){

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                id: this.lastID,
                message: 'Cliente cadastrado'
            });
        }
    );
});


// DELETAR CLIENTE
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.run(
        'DELETE FROM clients WHERE id = ?',
        [id],

        function(err){

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message: 'Cliente deletado'
            });
        }
    );
});

module.exports = router;