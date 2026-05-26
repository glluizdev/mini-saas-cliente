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
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);


app.use('/', clientsRoutes);
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