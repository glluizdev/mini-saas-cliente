const form = document.getElementById('clientForm');
const clientList = document.getElementById('clientList');
const totalClients = document.getElementById('totalClients');
const totalValue = document.getElementById('totalValue');

/* =========================
   CARREGAR CLIENTES
========================= */
async function loadClients() {
    const response = await fetch('http://localhost:3000/clients');
    const clients = await response.json();

    clientList.innerHTML = "";

    let total = 0;

    clients.forEach(client => {
        const value = Number(client.value) || 0;

        // soma só ativos
        if (client.status === "active") {
            total += value;
        }

        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${client.name}</strong><br>
            Empresa: ${client.company}<br>
            Telefone: ${client.phone}<br>
            Serviço: ${client.service}<br>
            Status: ${client.status === "active" ? "Ativo" : "Inativo"}<br>
            Valor: R$ ${value.toFixed(2).replace('.', ',')}<br>

            <button onclick="editClient('${client.id}')">Editar</button>
            <button onclick="deleteClient('${client.id}')">Excluir</button>
        `;

        clientList.appendChild(li);
    });

    totalClients.textContent = clients.length;

    totalValue.textContent = total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

/* =========================
   CADASTRAR CLIENTE
========================= */
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const rawValue = document.getElementById('value').value;

    const client = {
        name: document.getElementById('name').value,
        company: document.getElementById('company').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('service').value,
        value: Number(rawValue.replace(',', '.')),
        status: document.getElementById('status').value.toLowerCase()
    };

    await fetch('http://localhost:3000/clients', {
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
    const newName = prompt("Novo nome:");
    const newValue = prompt("Novo valor:");
    const newStatus = prompt("Status (active/inactive):");

    if (!newName || !newValue || !newStatus) return;

    await fetch(`http://localhost:3000/clients/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: newName,
            value: Number(newValue),
            status: newStatus.toLowerCase()
        })
    });

    loadClients();
}

/* =========================
   DELETAR CLIENTE
========================= */
async function deleteClient(id) {
    await fetch(`http://localhost:3000/clients/${id}`, {
        method: 'DELETE'
    });

    loadClients();
}

/* =========================
   INICIALIZAÇÃO
========================= */
loadClients();