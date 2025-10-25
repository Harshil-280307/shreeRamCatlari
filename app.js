// Replace with your Google Apps Script Web App URL
const API_URL = "https://script.google.com/macros/s/AKfycbyOO4Pi4l4VxgZasYcm8fQY2KYjv67FNJOLEWiGc1AP7xkACEC78U-kpLmaj19BMbqDEA/exec";

// ============================
// Vepari Bills
// ============================
async function addBill() {
  const billData = {
    name: document.getElementById("billName").value,
    amount: document.getElementById("billAmount").value,
    paidAmount: document.getElementById("billPaidAmount").value || 0,
    status: document.getElementById("billStatus").value,
    date: document.getElementById("billDate").value,
    notes: document.getElementById("billNotes").value
  };

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "add",
      sheet: "VepariBills",
      data: billData
    }),
  });
  alert("Bill added successfully!");
  loadAllBills();
}

async function loadAllBills() {
  const res = await fetch(`${API_URL}?sheet=VepariBills`);
  const bills = await res.json();

  const container = document.getElementById("allBillsList");
  container.innerHTML = "";

  if (!bills.length) {
    container.innerHTML = `<div class='empty-state'>No bills found</div>`;
    return;
  }

  bills.forEach(bill => {
    if (currentFilter !== "all" && bill.status !== currentFilter) return;

    const unpaid = bill.amount - bill.paidAmount;
    const div = document.createElement("div");
    div.className = `bill-item ${bill.status}`;
    div.innerHTML = `
      <div class="bill-header">
        <div class="bill-name">${bill.name}</div>
        <div class="bill-amount">₹${bill.amount}</div>
      </div>
      <div class="bill-status ${bill.status}">${bill.status}</div>
      <div class="bill-date">Date: ${bill.date}</div>
      <div class="bill-notes">${bill.notes || ''}</div>
      <div>Paid: ₹${bill.paidAmount || 0} | Unpaid: ₹${unpaid}</div>
      <div class="bill-actions">
        <button onclick="deleteBill('${bill.id}')">Delete</button>
      </div>
    `;
    container.appendChild(div);
  });
}

async function deleteBill(id) {
  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "delete",
      sheet: "VepariBills",
      id: id
    }),
  });
  alert("Bill deleted!");
  loadAllBills();
}

// ============================
// Daily Transactions
// ============================
async function addSale() {
  const data = {
    type: "sale",
    amount: document.getElementById("saleAmount").value,
    date: document.getElementById("saleDate").value,
    notes: document.getElementById("saleNotes").value
  };
  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ action: "add", sheet: "DailyTransactions", data })
  });
  alert("Sale added!");
  loadAllTransactions();
}

async function addExpense() {
  const data = {
    type: "expense",
    amount: document.getElementById("expenseAmount").value,
    date: document.getElementById("expenseDate").value,
    notes: document.getElementById("expenseNotes").value
  };
  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ action: "add", sheet: "DailyTransactions", data })
  });
  alert("Expense added!");
  loadAllTransactions();
}

async function loadAllTransactions() {
  const res = await fetch(`${API_URL}?sheet=DailyTransactions`);
  const data = await res.json();

  const salesContainer = document.getElementById("allSalesList");
  const expensesContainer = document.getElementById("allExpensesList");

  salesContainer.innerHTML = "";
  expensesContainer.innerHTML = "";

  data.forEach(item => {
    const div = document.createElement("div");
    div.className = `transaction-item ${item.type}`;
    div.innerHTML = `
      <div class="transaction-type">${item.type}</div>
      <div class="transaction-amount">₹${item.amount}</div>
      <div class="transaction-date">Date: ${item.date}</div>
      <div class="transaction-notes">${item.notes || ''}</div>
      <div class="transaction-actions">
        <button onclick="deleteTransaction('${item.id}')">Delete</button>
      </div>
    `;
    if (item.type === "sale") salesContainer.appendChild(div);
    else expensesContainer.appendChild(div);
  });
}

async function deleteTransaction(id) {
  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "delete",
      sheet: "DailyTransactions",
      id
    }),
  });
  alert("Deleted successfully!");
  loadAllTransactions();
}
