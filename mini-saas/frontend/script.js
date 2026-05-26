const API = import.meta.env.VITE_API_URL;

//MASCARA TELEFONE 
document
.getElementById('phone')
.addEventListener('input', (e) => {

    let value = e.target.value
        .replace(/\D/g, '');

    value = value
        .replace(/^(\d{2})(\d)/g, '($1) $2');

    value = value
        .replace(/(\d{5})(\d)/, '$1-$2');

    e.target.value = value;
});

//MASCARA CNPJ
document
.getElementById('cnpj')
.addEventListener('input', (e) => {

    let value = e.target.value
        .replace(/\D/g, '');

    value = value
        .replace(/^(\d{2})(\d)/, '$1.$2');

    value = value
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');

    value = value
        .replace(/\.(\d{3})(\d)/, '.$1/$2');

    value = value
        .replace(/(\d{4})(\d)/, '$1-$2');

    e.target.value = value;
});

/* =========================
   LOAD
========================= */
async function loadClients() {

    const res = await fetch(`${API}/clients`);

let clients = await res.json();

/* =========================
   BUSCA
========================= */

const search = document
    .getElementById('searchInput')
    .value
    .toLowerCase();

/* =========================
   FILTRO STATUS
========================= */

const statusFilter = document
    .getElementById('filterStatus')
    .value;

/* =========================
   FILTRAR
========================= */

clients = clients.filter(client => {

    const matchesSearch =

        client.company?.toLowerCase().includes(search)

        ||

        client.cnpj?.toLowerCase().includes(search)

        ||

        client.phone?.toLowerCase().includes(search)

        ||

        client.service?.toLowerCase().includes(search);

    const matchesStatus =

        !statusFilter

        ||

        client.status === statusFilter;

    return matchesSearch && matchesStatus;
});
    const list = document.getElementById('clientList');
    const totalClients = document.getElementById('totalClients');
    const totalValue = document.getElementById('totalValue');

    list.innerHTML = "";

    let total = 0;

    clients.forEach(c => {

        const value = Number(c.value) || 0;

        const installments = Number(c.installments) || 1;

        const paid = Number(c.paid_installments) || 0;

        const installmentValue = value / installments;
        const received = installmentValue * paid;
        const remaining = value - received;
        total += value;

        const formatBRL = (v) =>
            v.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

        const progress = (paid / installments) * 100;

        const li = document.createElement('li');

        li.className = "client-card";

        li.innerHTML = `

            <div class="client-top">

                <h3>${c.company}</h3>

                <span class="status ${c.status}">
                    ${c.status}
                </span>

            </div>

            <div class="info">
                🧾 ${c.cnpj}
            </div>

            <div class="info">
                📞 ${c.phone || '-'}
            </div>

            <div class="info">
                🛠 ${c.service || '-'}
            </div>

            <div class="info">
                💰 Total:
                ${formatBRL(value)}
            </div>

            <div class="info">
                ✅ Recebido:
                ${formatBRL(received)}
            </div>

            <div class="info">
                ⏳ Restante:
                ${formatBRL(remaining)}
            </div>

            <div class="installment-box">

                <strong>
                    ${installments}x de
                    ${formatBRL(installmentValue)}
                </strong>

                <div class="info">
                    Pagas:
                    ${paid}/${installments}
                </div>

                <div class="progress">

                    <div
                        class="progress-bar"
                        style="width:${progress}%"
                    ></div>

                </div>

            </div>

            <div
                style="
                    margin-top:15px;
                    display:flex;
                    gap:10px;
                    flex-wrap:wrap;
                "
            >

                <button onclick='openEdit(${JSON.stringify(c)})'>
                    Editar
                </button>

                <button
                    onclick='addParcel(${JSON.stringify(c)})'
                    style="background:#ca8a04;"
                >
                    Registrar Pagamento
                </button>

                <button
                    onclick="deleteClient(${c.id})"
                    style="background:#dc2626;"
                >
                    Excluir
                </button>

            </div>
        `;

        list.appendChild(li);
    });

    totalClients.textContent = clients.length;

    totalValue.textContent = total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

//FUNÇÂO EDITAR
function openEdit(client) {

    document.getElementById('editModal').style.display = 'flex';

    document.getElementById('editId').value = client.id;

    document.getElementById('editCompany').value = client.company;

    document.getElementById('editCnpj').value = client.cnpj;

    document.getElementById('editPhone').value = client.phone;

    document.getElementById('editService').value = client.service;

    document.getElementById('editValue').value = client.value;

    document.getElementById('editInstallments').value =
        client.installments;

    document.getElementById('editPaid').value =
        client.paid_installments || 0;

    document.getElementById('editStatus').value =
        client.status;
}

//FUNÇÂO SALVAR
async function saveEdit() {

    const id = document.getElementById('editId').value;

    const body = {

        company:
            document.getElementById('editCompany').value,

        cnpj:
            document.getElementById('editCnpj').value,

        phone:
            document.getElementById('editPhone').value,

        service:
            document.getElementById('editService').value,

        value:
            Number(
                document.getElementById('editValue')
                  .value
                 .replace(',', '.')
             ),

        installments:
            Number(
                document.getElementById('editInstallments').value
            ),

        paid_installments:
            Number(
                document.getElementById('editPaid').value
            ),

        status:
            document.getElementById('editStatus').value
    };

    await fetch(`${API}/clients/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(body)
    });

    showToast("Cliente atualizado com sucesso!");
    closeModal();
    loadClients();
}
/* =========================
   CREATE
========================= */
document.getElementById('clientForm')
.addEventListener('submit', async (e) => {

    e.preventDefault();

    const body = {
    company: company.value,
    cnpj: cnpj.value,
    phone: phone.value,
    service: service.value,

    value: Number(
        value.value.replace(',', '.')
    ),

    installments: Number(installments.value),
    status: status.value
};

    await fetch(`${API}/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

e.target.reset();

showToast("Cliente cadastrado com sucesso!");

loadClients();
});

/* =========================
   ADD PARCELA
========================= */
async function addParcel(client) {

    const paid = Number(client.paid_installments) || 0;

    const installments = Number(client.installments) || 1;

    if (paid >= installments) {

        alert("Todas as parcelas já foram pagas.");
        return;
    }

    const updatedPaid = paid + 1;

    let status = client.status;

    // Finaliza automaticamente
    if (updatedPaid >= installments) {
        status = "finalizado";
    }

    await fetch(`${API}/clients/${client.id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            company: client.company,
            cnpj: client.cnpj,
            phone: client.phone,
            service: client.service,

            value: client.value,

            installments: client.installments,

            paid_installments: updatedPaid,

            status: status
        })
    });
    showToast("Pagamento registrado!");
    loadClients();
}

/* =========================
   DELETE
========================= */
async function deleteClient(id) {

    const confirmDelete = confirm(
        "Deseja realmente excluir este cliente?"
    );

    if (!confirmDelete) return;

    await fetch(`${API}/clients/${id}`, {
        method: "DELETE"
    });

    showToast("Cliente excluído com sucesso!");

    loadClients();
}

//FUNÇÂO TOAST
function showToast(message) {

    const toast = document.getElementById('toast');

    toast.textContent = message;

    toast.classList.add('show');

    setTimeout(() => {

        toast.classList.remove('show');

    }, 3000);
}
//CLOSE MODEL
function closeModal() {

    document.getElementById('editModal').style.display = 'none';
}
/* INIT */
loadClients();