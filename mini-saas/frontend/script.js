
const API = "https://mini-saas-cliente.onrender.com";

/* =========================
   ELEMENTOS
========================= */
const form = document.getElementById('clientForm');
const clientList = document.getElementById('clientList');
const totalClients = document.getElementById('totalClients');
const totalValue = document.getElementById('totalValue');

/* =========================
   LISTAR CLIENTES
========================= */
async function loadClients() {
    const res = await fetch(`${API}/clients`);
    const clients = await res.json();

    clientList.innerHTML = "";

    let total = 0;

    clients.forEach(client => {

        // 🔥 garante número válido
        const value = parseFloat(client.value) || 0;

        // 🔥 normaliza status
        const status = (client.status || "").toLowerCase();

        // soma só ativos
        if (status === "active") {
            total += value;
        }

        const li = document.createElement('li');

        li.innerHTML = `
            <strong>${client.name}</strong><br>
            Empresa: ${client.company}<br>
            Telefone: ${client.phone}<br>
            Serviço: ${client.service}<br>

            Status: <span class="status ${status}">
                ${status === "active" ? "Ativo" : "Inativo"}
            </span><br>

            Valor: R$ ${value.toFixed(2)}<br><br>

            <button onclick="editClient('${client.id}')">Editar</button>
            <button onclick="deleteClient('${client.id}')">Excluir</button>
        `;

        clientList.appendChild(li);
    });

    totalClients.textContent = clients.length;
    totalValue.textContent = `R$ ${total.toFixed(2)}`;
}

/* =========================
   CADASTRAR CLIENTE
========================= */
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 🔥 CORREÇÃO PRINCIPAL DO PROBLEMA DO VALOR
    const rawValue = document.getElementById('value').value;

    const client = {
        name: document.getElementById('name').value,
        company: document.getElementById('company').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('service').value,

        // ✔ aceita 1000 ou 1000,50
        value: parseFloat(rawValue.replace(',', '.')) || 0,

        status: document.getElementById('status').value
    };

    await fetch(`${API}/clients`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(client)
    });

    form.reset();
    loadClients();
});

/* =========================
   EDITAR CLIENTE
========================= */
async function editClient(id) {

    const name = prompt("Novo nome:");
    const company = prompt("Nova empresa:");
    const phone = prompt("Novo telefone:");
    const service = prompt("Novo serviço:");
    const value = prompt("Novo valor:");
    const status = prompt("Status (active/inactive):");

    await fetch(`${API}/clients/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            company,
            phone,
            service,

            // 🔥 garante número correto
            value: parseFloat(value.replace(',', '.')) || 0,

            status
        })
    });

    loadClients();
}

/* =========================
   DELETE
========================= */
async function deleteClient(id) {
    await fetch(`${API}/clients/${id}`, {
        method: 'DELETE'
    });

    loadClients();
}

/* =========================
   INIT
========================= */
loadClients();