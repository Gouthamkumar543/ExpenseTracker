import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
import { getAuth, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyASz0n7VecKKKZaDT38szp5QE-dHVTKd0s",
  authDomain: "expensetracker-f9b7d.firebaseapp.com",
  projectId: "expensetracker-f9b7d",
  storageBucket: "expensetracker-f9b7d.firebasestorage.app",
  messagingSenderId: "852954230472",
  appId: "1:852954230472:web:0d5750f0433a878f723ffd"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth();

const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const date = document.getElementById("date");
const Logout = document.getElementById("Logout");
const chartTypeSelect = document.getElementById("chartTypeSelect");
const mail = document.getElementById("mail")

let gmail = null;
let transactions = [];
let chart = null;


function sanitizeEmail(email) {
  return email.replace(/\./g, '_');
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    gmail = user.email; 
    mail.innerHTML=`<p>${sanitizeEmail(gmail)}<p/>`
    Init();
  } else {
    signInAnonymously(auth).catch((error) => {
      console.error("Error during sign in:", error);
    });
  }
});

function addTransaction(e) {
  e.preventDefault();
  if (text.value.trim() === '' || amount.value.trim() === '' || date.value === "") {
    Swal.fire({
      title: "Missing Fields",
      text: "Please fill in all fields before submitting.",
      icon: "warning"
    });  
  } else {
    Swal.fire({
      title: "Transcation",
      text: "Sucessfully Added",
      icon: "success"
    });
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value,
      date: date.value
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateStorage();
    updateChart();

    text.value = '';
    amount.value = '';
    date.value = '';
  }
}

function generateID() {
  return Math.floor(Math.random() * 1000000000);
}

function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
    <span class="date">${transaction.date}</span>
  `;

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.textContent = "x";

  deleteBtn.addEventListener('click', () => removeTransaction(transaction.id));

  item.appendChild(deleteBtn);
  list.appendChild(item);
}

function updateValues() {
  const amounts = transactions.map((transaction) => transaction.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const income = amounts.filter((item) => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
  const expense = (amounts.filter((item) => item < 0).reduce((acc, item) => acc + item, 0) * -1).toFixed(2);

  balance.innerText = total;
  money_plus.innerText = income;
  money_minus.innerText = expense;
}

function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updateStorage();
  Init(); 
  updateChart();
}

function updateStorage() {
  if (!gmail) return;

  const sanitizedGmail = sanitizeEmail(gmail);
  const transactionsRef = ref(db, 'Users/' + sanitizedGmail + '/transactions');
  set(transactionsRef, transactions);
}

function Init() {
  if (!gmail) {
    return;
  }

  list.innerHTML = "";

  const sanitizedGmail = sanitizeEmail(gmail);
  const transactionsRef = ref(db, 'Users/' + sanitizedGmail + '/transactions');
  get(transactionsRef).then((snapshot) => {
    if (snapshot.exists()) {
      transactions = Object.values(snapshot.val());
      transactions.forEach(addTransactionDOM);
      updateValues();
      updateChart();
    } else {
      console.log("No transactions found for this user.");
    }
  }).catch((error) => {
    console.error("Error loading data: ", error);
  });
}


chartTypeSelect.addEventListener('change', (event) => {
  updateChart(event.target.value);
});

function updateChart(chartType = 'pie') {
  const amounts = transactions.map((transaction) => transaction.amount);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0);
  const expense = amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1;

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(myChart, createChartConfig(chartType, income, expense));
}

function createChartConfig(chartType, income, expense) {
  const chartConfig = {
    type: chartType,
    data: {
      labels: ['Income', 'Expense'],
      datasets: [{
        label: 'Amount',
        data: [income, expense],
        backgroundColor: chartType === 'pie' ? ['#4CAF50', '#F44336'] : ['#4CAF50', '#F44336'],
        borderColor: chartType === 'pie' ? ['#388E3C', '#D32F2F'] : ['#388E3C', '#D32F2F'],
        borderWidth: 1,
        fill: chartType === 'line',
        tension: chartType === 'line' ? 0.4 : 0
      }]
    },
    options: {
      responsive: true,
      scales: chartType === 'line' ? {
        y: {
          beginAtZero: true,
          grid: {
            drawOnChartArea: false
          }
        }
      } : undefined
    }
  };

  if (chartType === 'bar') {
    chartConfig.options.scales = {
      y: {
        beginAtZero: true
      }
    };
  }

  return chartConfig;
}

form.addEventListener('submit', addTransaction);

Logout.addEventListener("click", () => {
  location.href = "./../../Authentication/Login/Login.html";
});
