// ===== Firebase Setup =====
const firebaseConfig = {
     apiKey: "AIzaSyAwyTjuQkb8pwv4LLbO5clouuP9Yj8Cgik",
    authDomain: "harshilshopapp.firebaseapp.com",
    databaseURL: "https://harshilshopapp-default-rtdb.firebaseio.com",
    projectId: "harshilshopapp",
    storageBucket: "harshilshopapp.firebasestorage.app",
    messagingSenderId: "543880904532",
    appId: "1:543880904532:web:c60e609e113617d43f12c1",
    measurementId: "G-NH7SC9ETC9"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ===== Helper Functions =====

// --- Vepari Bills ---
function showAddBillForm() {
  document.getElementById('addBillForm').style.display = 'block';
  document.getElementById('updateBillSection').style.display = 'none';
}

function showUpdateBillForm() {
  document.getElementById('addBillForm').style.display = 'none';
  document.getElementById('updateBillSection').style.display = 'block';
  loadAllBills();
}

function addBill() {
  const name = document.getElementById('billName').value;
  const amount = document.getElementById('billAmount').value;
  const status = document.getElementById('billStatus').value;
  const date = document.getElementById('billDate').value;
  const notes = document.getElementById('billNotes').value;

  const newBillKey = db.ref('vepariBills').push().key;
  db.ref('vepariBills/' + newBillKey).set({
    name, amount, status, date, notes
  }).then(() => {
    alert('Bill Added!');
    document.getElementById('billName').value = '';
    document.getElementById('billAmount').value = '';
    loadAllBills();
    updateVepariSummary();
  });
}

function loadAllBills() {
  const list = document.getElementById('billList');
  list.innerHTML = '';
  db.ref('vepariBills').once('value', snapshot => {
    snapshot.forEach(bill => {
      const val = bill.val();
      const div = document.createElement('div');
      div.innerHTML = `
        <strong>${val.name}</strong> - ${val.amount} - ${val.status}
        <button onclick="deleteBill('${bill.key}')">Delete</button>
      `;
      list.appendChild(div);
    });
  });
}

function deleteBill(key) {
  if(confirm("Delete this bill?")) {
    db.ref('vepariBills/' + key).remove().then(() => {
      alert('Deleted!');
      loadAllBills();
      updateVepariSummary();
    });
  }
}

function updateVepariSummary() {
  let totalPaid = 0, totalPending = 0;
  db.ref('vepariBills').once('value', snapshot => {
    snapshot.forEach(bill => {
      if(bill.val().status === 'paid') totalPaid += parseFloat(bill.val().amount);
      else totalPending += parseFloat(bill.val().amount);
    });
    document.getElementById('totalPaid').innerText = totalPaid.toFixed(2);
    document.getElementById('totalPending').innerText = totalPending.toFixed(2);
    document.getElementById('totalMonth').innerText = (totalPaid + totalPending).toFixed(2);
  });
}

// --- Daily Bills ---
function showAddSaleForm() {
  document.getElementById('addSaleForm').style.display = 'block';
  document.getElementById('addExpenseForm').style.display = 'none';
}

function showAddExpenseForm() {
  document.getElementById('addSaleForm').style.display = 'none';
  document.getElementById('addExpenseForm').style.display = 'block';
}

function addSale() {
  const amount = document.getElementById('saleAmount').value;
  const date = document.getElementById('saleDate').value;
  const notes = document.getElementById('saleNotes').value;

  const key = db.ref('dailyBills').push().key;
  db.ref('dailyBills/' + key).set({
    type: 'sale',
    amount, date, notes
  }).then(() => {
    alert('Sale Added!');
    document.getElementById('saleAmount').value = '';
    updateDailySummary();
  });
}

function addExpense() {
  const amount = document.getElementById('expenseAmount').value;
  const date = document.getElementById('expenseDate').value;
  const notes = document.getElementById('expenseNotes').value;

  const key = db.ref('dailyBills').push().key;
  db.ref('dailyBills/' + key).set({
    type: 'expense',
    amount, date, notes
  }).then(() => {
    alert('Expense Added!');
    document.getElementById('expenseAmount').value = '';
    updateDailySummary();
  });
}

function updateDailySummary() {
  let totalSale = 0, totalExpense = 0;
  db.ref('dailyBills').once('value', snapshot => {
    snapshot.forEach(record => {
      const val = record.val();
      if(val.type === 'sale') totalSale += parseFloat(val.amount);
      if(val.type === 'expense') totalExpense += parseFloat(val.amount);
    });
    document.getElementById('totalSale').innerText = totalSale.toFixed(2);
    document.getElementById('totalExpense').innerText = totalExpense.toFixed(2);
    document.getElementById('dailyProfit').innerText = (totalSale - totalExpense).toFixed(2);
  });
}

// Initial summary load
updateVepariSummary();
updateDailySummary();
