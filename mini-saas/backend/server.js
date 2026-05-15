const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   SUPABASE
========================= */
const supabase = createClient(
    "https://vcjzygsailgfhoojzzhr.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjanp5Z3NhaWxnZmhvb2p6emhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMTE2OTUsImV4cCI6MjA5Mzc4NzY5NX0.ycN6eCJEyOIfCkymOMSYi2F60H4TZ1GXNeP0yiDpwng"
);

/* =========================
   LISTAR
========================= */
app.get('/clients', async (req, res) => {

    const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        return res.status(500).json({ erro: error.message });
    }

    res.json(data);
});

/* =========================
   CRIAR
========================= */
app.post('/clients', async (req, res) => {

    const {
        company,
        cnpj,
        phone,
        service,
        value,
        installments,
        status
    } = req.body;

    const valueNumber = Number(value) || 0;
    const installmentsNumber = Number(installments) || 1;

    const installmentValue = valueNumber / installmentsNumber;

    const { data, error } = await supabase
        .from('clients')
        .insert([{
            company,
            cnpj,
            phone,
            service,
            value: valueNumber,
            installments: installmentsNumber,
            installment_value: installmentValue,
            paid_installments: 0,
            status
        }])
        .select();

    if (error) {
        return res.status(500).json({ erro: error.message });
    }

    res.json(data);
});

/* =========================
   EDITAR (com regra parcelas)
========================= */
app.put('/clients/:id', async (req, res) => {

    const { id } = req.params;

    const {
        company,
        cnpj,
        phone,
        service,
        value,
        installments,
        paid_installments,
        status
    } = req.body;

    const valueNumber = Number(value) || 0;
    const installmentsNumber = Number(installments) || 1;
    const paidNumber = Number(paid_installments) || 0;

    const installmentValue = valueNumber / installmentsNumber;

    let finalStatus = status;

    if (paidNumber >= installmentsNumber) {
        finalStatus = "finalizado";
    }

    const { data, error } = await supabase
        .from('clients')
        .update({
            company,
            cnpj,
            phone,
            service,
            value: valueNumber,
            installments: installmentsNumber,
            installment_value: installmentValue,
            paid_installments: paidNumber,
            status: finalStatus
        })
        .eq('id', id)
        .select();

    if (error) {
        return res.status(500).json({ erro: error.message });
    }

    res.json(data);
});

/* =========================
   DELETE
========================= */
app.delete('/clients/:id', async (req, res) => {

    const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', req.params.id);

    if (error) {
        return res.status(500).json({ erro: error.message });
    }

    res.json({ ok: true });
});

/* ========================= */
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});