window.onload = async () => {
  const res = await fetch('/check-auth');
  const data = await res.json();
  if (!data.loggedIn) window.location.href = '/login.html';
  document.getElementById('user-name').innerText = data.username;
  loadExpenses();
};

document.getElementById('expenseForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  await fetch('/add-expense', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  });

  e.target.reset();
  loadExpenses();
});

async function loadExpenses() {
  const res = await fetch('/expenses');
  const expenses = await res.json();

  const tbody = document.querySelector('#expenseTable tbody');
  tbody.innerHTML = '';
  let total = 0;
  const categoryTotals = {};

  expenses.forEach(exp => {
    total += parseFloat(exp.amount);
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + parseFloat(exp.amount);

    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${exp.category}</td><td>₹${exp.amount}</td>`;
    tbody.appendChild(tr);
  });

  document.getElementById('total-expense').innerText = `Total: ₹${total}`;

  const ctx = document.getElementById('expenseChart').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(categoryTotals),
      datasets: [{
        label: 'Expenses',
        data: Object.values(categoryTotals),
        backgroundColor: ['#f39c12', '#3498db', '#2ecc71', '#e74c3c']
      }]
    }
  });
}

function logout() {
  fetch('/logout').then(() => window.location.href = '/login.html');
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Expense Report", 14, 20);

  const tableRows = [];
  const rows = document.querySelectorAll("#expenseTable tbody tr");
  rows.forEach(row => {
    const cells = row.querySelectorAll("td");
    tableRows.push([cells[0].innerText, cells[1].innerText]);
  });

  doc.autoTable({
    head: [['Category', 'Amount']],
    body: tableRows,
    startY: 30
  });

  doc.save("expenses.pdf");
}
