// ============================
// Replace with your Google Apps Script Web App URL
// ============================
const API_URL = "https://script.google.com/macros/s/AKfycbz_eBAgSIaypXbantqw1lWwZnZEzhgqqw2uIGMBoLrEjk26COXucQAhQBEMlPbIp53R/exec"; // <-- Replace this

// ============================
// Vepari Bills Functions
// ============================

// Add a new bill
async function addBill() {
  const billData = {
    name: document.getElementById("billName").value,
    amount: parseFloat(document.getElementById("billAmount").value),
    paidAmount: parseFloat(document.getElementById("billPaidAmount").value) || 0,
    status: document.getElementById("billStatus").value,
    date: document.getElementById("billDate").value,
    notes: document.getElementById("billNotes").value
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "add",
        sheet: "VepariBills",
        data: billData
      }),
    });

    const text = await res.text();
    alert(text);
    loadAllBills();
  } catch (err) {
    console.error(err);
    alert("Failed to add bill. Check console.");
  }
}

// Load all bills
async function loadAllBills() {
  try {
    const res = await fetch(`${API_URL}?sheet=VepariBills`);
    const bills = await res.json();

    const container = document.getElementById("allBillsList");
    container.innerHTML = "";

    if (!bills.length) {
      container.innerHTML = `<div class='empty-state'>No bills found</div>`;
      return;
    }

    bills.forEach(bill => {
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
  } catch (err) {
    console.error(err);
    alert("Failed to load bills.");
  }
}

// Delete a bill
async function deleteBill(id) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "delete",
        sheet: "VepariBills",
        id: id
      }),
    });
    const text = await res.text();
    alert(text);
    loadAllBills();
  } catch (err) {
    console.error(err);
    alert("Failed to delete bill.");
  }
}

// ============================
// Daily Transactions Functions
// ============================

// Add a sale
async function addSale() {
  const data = {
    type: "sale",
    amount: parseFloat(document.getElementById("saleAmount").value),
    date: document.getElementById("saleDate").value,
    notes: document.getElementById("saleNotes").value
  };
  await addTransaction("DailyTransactions", data);
}

// Add an expense
async function addExpense() {
  const data = {
    type: "expense",
    amount: parseFloat(document.getElementById("expenseAmount").value),
    date: document.getElementById("expenseDate").value,
    notes: document.getElementById("expenseNotes").value
  };
  await addTransaction("DailyTransactions", data);
}

// Generic add transaction
async function addTransaction(sheet, data) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", sheet, data })
    });
    const text = await res.text();
    alert(text);
    loadAllTransactions();
  } catch (err) {
    console.error(err);
    alert("Failed to add transaction.");
  }
}

// Load all transactions
async function loadAllTransactions() {
  try {
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
  } catch (err) {
    console.error(err);
    alert("Failed to load transactions.");
  }
}

// Delete a transaction
async function deleteTransaction(id) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", sheet: "DailyTransactions", id })
    });
    const text = await res.text();
    alert(text);
    loadAllTransactions();
  } catch (err) {
    console.error(err);
    alert("Failed to delete transaction.");
  }
}

// ============================
// Initialize data on page load
// ============================
window.addEventListener("DOMContentLoaded", () => {
  loadAllBills();
  loadAllTransactions();
});
