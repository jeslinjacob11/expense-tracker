const API = "/expenses";

let chart = null;
let allExpenses = [];

/* ==========================
   LOAD DASHBOARD
========================== */

window.onload = () => {
    loadExpenses();
};

/* ==========================
   LOAD EXPENSES
========================== */

async function loadExpenses() {

    try {

        const response = await fetch(API);

        allExpenses = await response.json();

        renderTable(allExpenses);

        updateCards(allExpenses);

        drawChart(allExpenses);

    }

    catch (error) {

        console.error("Error loading expenses:", error);

    }

}

/* ==========================
   ADD EXPENSE
========================== */

document
    .getElementById("expenseForm")
    .addEventListener("submit", async (e) => {

        e.preventDefault();

        const expense = {

            title: document.getElementById("title").value.trim(),

            category: document.getElementById("category").value,

            amount: Number(document.getElementById("amount").value),

            date: document.getElementById("date").value

        };

        try {

            const response = await fetch(API, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(expense)

            });

            if (!response.ok) {

                alert("Unable to add expense.");

                return;

            }

            document.getElementById("expenseForm").reset();

            loadExpenses();

        }

        catch (error) {

            console.error(error);

        }

    });

/* ==========================
   RENDER TABLE
========================== */

function renderTable(expenses) {

    const table = document.getElementById("expenseTable");

    const emptyState = document.getElementById("emptyState");

    table.innerHTML = "";

    if (expenses.length === 0) {

        emptyState.style.display = "block";

        return;

    }

    emptyState.style.display = "none";

    expenses.forEach(expense => {

        table.innerHTML += `

        <tr>

            <td>${expense.id}</td>

            <td>${expense.title}</td>

            <td>${expense.category}</td>

            <td>₹${expense.amount}</td>

            <td>${formatDate(expense.date)}</td>

            <td>

                <button
                    class="delete-btn"
                    onclick="deleteExpense(${expense.id})">

                    🗑

                </button>

            </td>

        </tr>

        `;

    });

}

/* ==========================
   DELETE
========================== */

async function deleteExpense(id) {

    const confirmDelete = confirm(
        "Delete this expense?"
    );

    if (!confirmDelete) return;

    try {

        await fetch(`${API}/${id}`, {

            method: "DELETE"

        });

        loadExpenses();

    }

    catch (error) {

        console.error(error);

    }

}

/* ==========================
   FORMAT DATE
========================== */

function formatDate(dateString) {

    return new Date(dateString).toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}
/* ==========================
   FILTER
========================== */

document
.getElementById("filterBtn")
.addEventListener("click",()=>{

    const category =
    document.getElementById("filterCategory").value;

    const search =
    document
    .getElementById("searchExpense")
    .value
    .toLowerCase();

    let filtered = allExpenses;

    if(category!==""){

        filtered = filtered.filter(expense=>

            expense.category===category

        );

    }

    if(search!==""){

        filtered = filtered.filter(expense=>

            expense.title
            .toLowerCase()
            .includes(search)

        );

    }

    renderTable(filtered);

    updateCards(filtered);

    drawChart(filtered);

});

/* ==========================
   SHOW ALL
========================== */

document
.getElementById("showAllBtn")
.addEventListener("click",()=>{

    document.getElementById("filterCategory").value="";

    document.getElementById("searchExpense").value="";

    renderTable(allExpenses);

    updateCards(allExpenses);

    drawChart(allExpenses);

});

/* ==========================
   SUMMARY CARDS
========================== */

function updateCards(expenses){

    let total = 0;

    let highest = 0;

    expenses.forEach(expense=>{

        total += expense.amount;

        if(expense.amount>highest){

            highest = expense.amount;

        }

    });

    const average =

        expenses.length===0

        ?0

        :(total/expenses.length);

    document.getElementById("totalExpense").innerText =
    `₹${total.toFixed(2)}`;

    document.getElementById("highestExpense").innerText =
    `₹${highest.toFixed(2)}`;

    document.getElementById("averageExpense").innerText =
    `₹${average.toFixed(2)}`;

    document.getElementById("totalRecords").innerText =
    expenses.length;

}
/* ==========================
   PIE CHART
========================== */

function drawChart(expenses){

    const categories={};

    expenses.forEach(expense=>{

        if(categories[expense.category]){

            categories[expense.category]+=expense.amount;

        }

        else{

            categories[expense.category]=expense.amount;

        }

    });

    const labels=Object.keys(categories);

    const values=Object.values(categories);

    if(chart){

        chart.destroy();

    }

    chart=new Chart(

        document.getElementById("expenseChart"),

        {

            type:"pie",

            data:{

                labels:labels,

                datasets:[{

                    data:values,

                    backgroundColor:[

                        "#3b82f6",

                        "#10b981",

                        "#f59e0b",

                        "#ef4444",

                        "#8b5cf6",

                        "#06b6d4",

                        "#84cc16",

                        "#ec4899",

                        "#f97316"

                    ],

                    borderWidth:2

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:true,

                plugins:{

                    legend:{

                        position:"bottom"

                    }

                }

            }

        }

    );

}