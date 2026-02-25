const API_URL = 'http://localhost:5005/api';

// Format currency
function formatCurrency(amount) {
    return '₹' + Number(amount).toLocaleString('en-IN');
}

// Chart variables
let purposeChartInstance = null;
let monthlyChartInstance = null;

// Dashboard Logic
async function loadDashboard() {
    const totalGivenEl = document.getElementById('totalGivenAmount');
    if (!totalGivenEl) return; // Not on dashboard page

    try {
        const [personsRes, txRes] = await Promise.all([
            fetch(`${API_URL}/persons`),
            fetch(`${API_URL}/transactions`)
        ]);

        const persons = await personsRes.json();
        const transactions = await txRes.json();

        let totalGiven = 0;
        let totalReceived = 0;

        transactions.forEach(tx => {
            if (tx.type === 'given') totalGiven += tx.amount;
            if (tx.type === 'received') totalReceived += tx.amount;
        });

        const totalPending = totalGiven - totalReceived;

        document.getElementById('totalGivenAmount').textContent = formatCurrency(totalGiven);
        document.getElementById('totalReceivedAmount').textContent = formatCurrency(totalReceived);
        document.getElementById('totalPendingAmount').textContent = formatCurrency(totalPending);
        document.getElementById('totalPersonsCount').textContent = persons.length;

        renderPersonsList(persons, transactions);
        renderCharts(persons, transactions);

        // Setup filters
        const searchInput = document.getElementById('searchPerson');
        const filterSelect = document.getElementById('filterPurpose');

        function applyFilters() {
            const p = filterSelect.value;
            const s = searchInput.value.toLowerCase();

            const filtered = persons.filter(person => {
                const matchName = person.name.toLowerCase().includes(s);
                const matchPurpose = p === "" || person.purpose === p;
                return matchName && matchPurpose;
            });
            renderPersonsList(filtered, transactions);
        }

        searchInput.addEventListener('input', applyFilters);
        filterSelect.addEventListener('change', applyFilters);

    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function renderPersonsList(persons, allTransactions) {
    const container = document.getElementById('personsListContainer');
    container.innerHTML = '';

    if (persons.length === 0) {
        container.innerHTML = '<p class="text-muted" style="padding: 1rem;">No persons found.</p>';
        return;
    }

    persons.forEach(person => {
        let given = 0;
        let received = 0;
        const pTxs = allTransactions.filter(tx => tx.personId === person._id);

        pTxs.forEach(tx => {
            if (tx.type === 'given') given += tx.amount;
            if (tx.type === 'received') received += tx.amount;
        });
        const balance = given - received;

        const el = document.createElement('a');
        el.href = `person-details.html?id=${person._id}`;
        el.className = 'person-item';

        let balanceText, balanceClass;
        if (balance > 0) {
            balanceText = `${formatCurrency(balance)} (To Get)`;
            balanceClass = 'text-success';
        } else if (balance < 0) {
            balanceText = `${formatCurrency(Math.abs(balance))} (To Pay)`;
            balanceClass = 'text-danger';
        } else {
            balanceText = '₹0';
            balanceClass = '';
        }

        el.innerHTML = `
      <div class="person-info">
        <h4>${person.name}</h4>
        <div class="person-meta">${person.purpose} ${person.phone ? '• ' + person.phone : ''}</div>
      </div>
      <div class="person-balance ${balanceClass}">
        ${balanceText}
      </div>
    `;
        container.appendChild(el);
    });
}

function renderCharts(persons, transactions) {
    const purposeMap = {};
    transactions.forEach(tx => {
        const person = persons.find(p => p._id === tx.personId);
        if (person) {
            purposeMap[person.purpose] = (purposeMap[person.purpose] || 0) + tx.amount;
        }
    });

    const ctxPie = document.getElementById('purposePieChart')?.getContext('2d');
    if (ctxPie) {
        if (purposeChartInstance) purposeChartInstance.destroy();
        purposeChartInstance = new Chart(ctxPie, {
            type: 'pie',
            data: {
                labels: Object.keys(purposeMap),
                datasets: [{
                    data: Object.values(purposeMap),
                    backgroundColor: [
                        '#4F46E5', '#10B981', '#F59E0B', '#EF4444',
                        '#8B5CF6', '#EC4899', '#14B8A6'
                    ]
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    const monthMap = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const d = new Date();
    for (let i = 5; i >= 0; i--) {
        const past = new Date(d.getFullYear(), d.getMonth() - i, 1);
        const key = `${monthNames[past.getMonth()]} ${past.getFullYear()}`;
        monthMap[key] = { given: 0, received: 0 };
    }

    transactions.forEach(tx => {
        const date = new Date(tx.date);
        const key = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        if (monthMap[key]) {
            monthMap[key][tx.type] += tx.amount;
        }
    });

    const ctxBar = document.getElementById('monthlyBarChart')?.getContext('2d');
    if (ctxBar) {
        if (monthlyChartInstance) monthlyChartInstance.destroy();
        monthlyChartInstance = new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: Object.keys(monthMap),
                datasets: [
                    {
                        label: 'Given',
                        data: Object.keys(monthMap).map(k => monthMap[k].given),
                        backgroundColor: '#EF4444'
                    },
                    {
                        label: 'Received',
                        data: Object.keys(monthMap).map(k => monthMap[k].received),
                        backgroundColor: '#10B981'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true } }
            }
        });
    }
}

// Add Person Logic
function setupAddPerson() {
    const form = document.getElementById('addPersonForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const saveBtn = form.querySelector('button[type="submit"]');
        saveBtn.disabled = true;

        try {
            const data = {
                name: document.getElementById('personName').value,
                phone: document.getElementById('personPhone').value,
                purpose: document.getElementById('personPurpose').value
            };

            const res = await fetch(`${API_URL}/persons`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                window.location.href = 'index.html';
            } else {
                const error = await res.json();
                alert('Error: ' + error.message);
                saveBtn.disabled = false;
            }
        } catch (err) {
            alert('Error connecting to server.');
            saveBtn.disabled = false;
        }
    });
}

// Person Details Logic
async function loadPersonDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const personId = urlParams.get('id');
    if (!personId || !document.getElementById('pdName')) return;

    try {
        const [personRes, txRes] = await Promise.all([
            fetch(`${API_URL}/persons/${personId}`),
            fetch(`${API_URL}/transactions/${personId}`)
        ]);

        if (!personRes.ok) {
            document.getElementById('pdName').textContent = 'Person not found';
            return;
        }

        const person = await personRes.json();
        const transactions = await txRes.json();

        document.getElementById('pdName').textContent = person.name;
        document.getElementById('pdDetails').textContent = `${person.purpose} ${person.phone ? '• ' + person.phone : ''}`;

        let given = 0;
        let received = 0;

        const listContainer = document.getElementById('transactionsListContainer');
        listContainer.innerHTML = '';

        if (transactions.length === 0) {
            listContainer.innerHTML = '<p class="text-muted" style="padding: 1rem;">No transactions yet.</p>';
        }

        transactions.forEach(tx => {
            if (tx.type === 'given') given += tx.amount;
            if (tx.type === 'received') received += tx.amount;

            const dateStr = new Date(tx.date).toLocaleDateString();
            const typeLabel = tx.type === 'given' ? 'Given (-)' : 'Received (+)';

            const el = document.createElement('div');
            el.className = 'transaction-item';
            el.innerHTML = `
        <div class="transaction-details">
          <h4>${formatCurrency(tx.amount)} <span class="tag">${typeLabel}</span></h4>
          <div class="person-meta">${dateStr} ${tx.note ? '• ' + tx.note : ''}</div>
        </div>
        <button class="btn btn-outline btn-sm delete-tx-btn" data-id="${tx._id}">🗑️</button>
      `;
            listContainer.appendChild(el);
        });

        const balance = given - received;

        document.getElementById('pdTotalGiven').textContent = formatCurrency(given);
        document.getElementById('pdTotalReceived').textContent = formatCurrency(received);

        const balanceEl = document.getElementById('pdBalance');
        if (balance > 0) {
            balanceEl.textContent = `${formatCurrency(balance)} (To Get)`;
            balanceEl.className = 'stat-value text-success';
        } else if (balance < 0) {
            balanceEl.textContent = `${formatCurrency(Math.abs(balance))} (To Pay)`;
            balanceEl.className = 'stat-value text-danger';
        } else {
            balanceEl.textContent = '₹0';
            balanceEl.className = 'stat-value';
        }

        // Delete Person
        document.getElementById('deletePersonBtn').onclick = async () => {
            if (confirm('Are you sure you want to delete this person and all their transactions?')) {
                await fetch(`${API_URL}/persons/${personId}`, { method: 'DELETE' });
                window.location.href = 'index.html';
            }
        };

        // Add Transaction
        const form = document.getElementById('addTransactionForm');
        form.onsubmit = async (e) => {
            e.preventDefault();
            const data = {
                type: document.getElementById('transType').value,
                amount: Number(document.getElementById('transAmount').value),
                date: document.getElementById('transDate').value,
                note: document.getElementById('transNote').value
            };

            await fetch(`${API_URL}/transactions/${personId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            window.location.reload();
        };

        // Delete Transaction delegate
        listContainer.addEventListener('click', async (e) => {
            const btn = e.target.closest('.delete-tx-btn');
            if (btn && confirm('Delete this transaction?')) {
                const txId = btn.getAttribute('data-id');
                await fetch(`${API_URL}/transactions/${txId}`, { method: 'DELETE' });
                window.location.reload();
            }
        });

    } catch (error) {
        console.error('Error loading person details:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
    setupAddPerson();
    loadPersonDetails();
});
