const supabase = require('../config/supabase');

/* =========================
   LISTAR CLIENTES
========================= */

exports.getClients = async (req, res) => {

    try {

        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .order('id', { ascending: false });

        if (error) {
            console.error("❌ SUPABASE ERROR (GET):", error);

            return res.status(500).json({
                erro: error.message
            });
        }

        res.json(data);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            erro: "Erro interno no servidor"
        });

    }

};

/* =========================
   CRIAR CLIENTE
========================= */

exports.createClient = async (req, res) => {

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

        const valueNumber = Number(
            String(value).replace(',', '.')
        ) || 0;

        const installmentsNumber =
            Number(installments) || 1;

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

            console.error(
                "❌ SUPABASE ERROR (POST):",
                error
            );

            return res.status(500).json({
                erro: error.message
            });

        }

        res.json(data);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            erro: "Erro interno no servidor"
        });

    }

};

/* =========================
   EDITAR CLIENTE
========================= */

exports.updateClient = async (req, res) => {

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

        const valueNumber = Number(
            String(value).replace(',', '.')
        ) || 0;

        const installmentsNumber =
            Number(installments) || 1;

        const paidNumber =
            Number(paid_installments) || 0;

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

            console.error(
                "❌ SUPABASE ERROR (PUT):",
                error
            );

            return res.status(500).json({
                erro: error.message
            });

        }

        res.json(data);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            erro: "Erro interno no servidor"
        });

    }

};

/* =========================
   DELETAR CLIENTE
========================= */

exports.deleteClient = async (req, res) => {

    try {

        const { error } = await supabase
            .from('clients')
            .delete()
            .eq('id', req.params.id);

        if (error) {

            console.error(
                "❌ SUPABASE ERROR (DELETE):",
                error
            );

            return res.status(500).json({
                erro: error.message
            });

        }

        res.json({
            message: "ok"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            erro: "Erro interno no servidor"
        });

    }

};

/* =========================
   TESTE BANCO
========================= */

exports.testDb = async (req, res) => {

    try {

        const { data, error } = await supabase
            .from('clients')
            .select('*');

        res.json({
            data,
            error
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            erro: "Erro interno no servidor"
        });

    }

};