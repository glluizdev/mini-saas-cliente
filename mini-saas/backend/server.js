require('dotenv').config();

const express = require('express');
const cors = require('cors');

const clientsRoutes = require('./routes/clients');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   ROTAS
========================= */

app.get('/', (req, res) => {
    res.json({
        message: 'API funcionando'
    });
});

app.use('/clients', clientsRoutes);
app.use('/auth', authRoutes);

/* =========================
   SERVIDOR
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `Servidor rodando na porta ${PORT}`
    );

});