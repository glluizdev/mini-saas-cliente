const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

app.use(cors());
app.use(express.json());

// 🔑 SUPABASE
const supabaseUrl = "https://mqfnjkvwzjcagfvtvvax.supabase.co";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "SUA_ANON_KEY_AQUI";

const supabase = createClient(supabaseUrl, supabaseKey);

/* =========================
   LISTAR CLIENTES
========================= */
app.get('/clients', async (req, res) => {
    const { data, error } = await supabase
        .from('clients')
        .select('*');

    if (error) return res.status(500).json(error);

    res.json(data);
});

/* =========================
   CRIAR CLIENTE
========================= */
app.post('/clients', async (req, res) => {
    const { data, error } = await supabase
        .from('clients')
        .insert([req.body]);

    if (error) {
        console.log("ERRO:", error);
        return res.status(500).json(error);
    }

    res.json(data);
});

/* =========================
   ATUALIZAR CLIENTE
========================= */
app.put('/clients/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('clients')
        .update(req.body)
        .eq('id', req.params.id);

    if (error) return res.status(500).json(error);

    res.json(data);
});

/* =========================
   DELETAR CLIENTE
========================= */
app.delete('/clients/:id', async (req, res) => {
    const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', req.params.id);

    if (error) return res.status(500).json(error);

    res.json({ message: "ok" });
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("🚀 Servidor rodando na porta " + PORT);
});