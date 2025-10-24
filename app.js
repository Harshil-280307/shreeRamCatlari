// Firebase config
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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Function to update dashboard summary (example)
function updateDashboard() {
  // Daily Income
  db.ref('dailyBills').once('value', snapshot => {
    let totalIncome = 0;
    let totalExpense = 0;
    snapshot.forEach(day => {
      day.forEach(record => {
        const val = record.val();
        if(val.type === 'sale') totalIncome += parseFloat(val.amount);
        if(val.type === 'expense') totalExpense += parseFloat(val.amount);
      });
    });
    document.getElementById('dailyAvg').innerText = totalIncome.toFixed(2);
    document.getElementById('dailyExpense').innerText = totalExpense.toFixed(2);
    document.getElementById('dailyProfit').innerText = (totalIncome - totalExpense).toFixed(2);
    document.getElementById('monthlyIncome').innerText = totalIncome.toFixed(2);
    document.getElementById('yearlyIncome').innerText = totalIncome.toFixed(2);
  });
}

// Call dashboard update
updateDashboard();
