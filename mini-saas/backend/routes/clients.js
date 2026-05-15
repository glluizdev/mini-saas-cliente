const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

/* =========================
   LISTAR CLIENTES (DEBUG REAL)
========================= */
router.get('/clients', async (req, res) => {

    const { data, error } = await supabase
        .from('clients')
        .select('*');

    console.log("📦 DATA:", data);
    console.log("❌ ERROR:", JSON.stringify(error, null, 2));

    if (error) {
        return res.status(500).json({
            erro: error.message,
            codigo: error.code,
            detalhes: error
        });
    }

    return res.json(data);
});

/* =========================
   CRIAR CLIENTE
========================= */
router.post('/clients', async (req, res) => {

    try {

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

        const installmentValue =
            valueNumber / installmentsNumber;

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
            console.error("❌ SUPABASE ERROR (POST):", error);
            return res.status(500).json(error);
        }

        res.json(data);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            erro: "Erro interno no servidor"
        });
    }
});

/* =========================
   EDITAR CLIENTE + STATUS AUTOMÁTICO
========================= */
router.put('/clients/:id', async (req, res) => {

    try {

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

        const installmentValue =
            valueNumber / installmentsNumber;

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
            console.error("❌ SUPABASE ERROR (PUT):", error);
            return res.status(500).json(error);
        }

        res.json(data);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            erro: "Erro interno no servidor"
        });
    }
});

/* =========================
   DELETAR CLIENTE
========================= */
router.delete('/clients/:id', async (req, res) => {

    try {

        const { error } = await supabase
            .from('clients')
            .delete()
            .eq('id', req.params.id);

        if (error) {
            console.error("❌ SUPABASE ERROR (DELETE):", error);
            return res.status(500).json(error);
        }

        res.json({ message: "ok" });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            erro: "Erro interno no servidor"
        });
    }
});

/* =========================
   TESTE DE CONEXÃO
========================= */
router.get('/test-db', async (req, res) => {

    const { data, error } = await supabase
        .from('clients')
        .select('*');

    res.json({
        data,
        error
    });
});

module.exports = router;