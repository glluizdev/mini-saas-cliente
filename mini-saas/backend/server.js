const express = require('express')
const cors = require('cors')
const path = require('path')
const { supabase } = require('./supabase.js')
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname)))
/* =========================
   TESTE SUPABASE
========================= */
app.get('/test-supabase', async (req, res) => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
  if (error) {
    console.log("ERRO TEST:", error)
    return res.status(500).json(error)
  }
  res.json(data)
})
/* =========================
   GET CLIENTES
========================= */
app.get('/clients', async (req, res) => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    console.log("ERRO GET:", error)
    return res.status(500).json(error)
  }
  res.json(data)
})
/* =========================
   CREATE CLIENTE (COM DEBUG)
========================= */
app.post('/clients', async (req, res) => {
  console.log("📥 BODY RECEBIDO:", req.body)
  const { name, company, phone, service, value, status } = req.body
  if (!name) {
    return res.status(400).json({ error: "Nome é obrigatório" })
  }
  const { data, error } = await supabase
    .from('clients')
    .insert([
      {
        name,
        company,
        phone,
        service,
        value,
        status
      }
    ])
    .select()
  if (error) {
    console.log("❌ ERRO SUPABASE INSERT:", error)
    return res.status(500).json(error)
  }
  res.json(data)
})
/* =========================
   DELETE CLIENTE
========================= */
app.delete('/clients/:id', async (req, res) => {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', req.params.id)
  if (error) {
    console.log("ERRO DELETE:", error)
    return res.status(500).json(error)
  }
  res.json({ message: "Cliente deletado com sucesso!" })
})
/* =========================
   UPDATE CLIENTE
========================= */
app.put('/clients/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('clients')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
  if (error) {
    console.log("ERRO UPDATE:", error)
    return res.status(500).json(error)
  }
  res.json(data)
})
/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
})