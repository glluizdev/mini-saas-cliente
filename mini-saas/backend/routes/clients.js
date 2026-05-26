const express = require('express');

const router = express.Router();

const {
    getClients,
    createClient,
    updateClient,
    deleteClient,
    testDb
} = require('../controllers/clientsController');

/* =========================
   ROTAS
========================= */

router.get('/clients', getClients);

router.post('/clients', createClient);

router.put('/clients/:id', updateClient);

router.delete('/clients/:id', deleteClient);

router.get('/test-db', testDb);

module.exports = router;