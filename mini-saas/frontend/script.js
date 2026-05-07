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
        const value = Number(client.value) || 0;

        if (client.status === "active") {
            total += value;
        }

        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${client.name}</strong><br>
            Empresa: ${client.company}<br>
            Telefone: ${client.phone}<br>
            Serviço: ${client.service}<br>
            Status: ${client.status}<br>
            Valor: R$ ${value.toFixed(2)}<br>

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

    const client = {
        name: document.getElementById('name').value,
        company: document.getElementById('company').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('service').value,
        value: Number(document.getElementById('value').value),
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
loadClients();S