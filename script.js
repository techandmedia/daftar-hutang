function showTab(tabId) {
  document
    .querySelectorAll(".tab-content")
    .forEach((el) => (el.style.display = "none"));
  document.getElementById(tabId).style.display = "block";
  document
    .querySelectorAll(".tab-button")
    .forEach((btn) => btn.classList.remove("active"));
  const activeButton = Array.from(
    document.querySelectorAll(".tab-button")
  ).find((btn) =>
    btn.textContent.includes(tabId === "dollar" ? "Dolar" : "Rupiah")
  );
  activeButton.classList.add("active");
}

const data = {
  dollar: {
    loans: [
      { date: "2024-01-10", amount: 100 },
      { date: "2024-02-15", amount: 250 },
    ],
    payments: [
      { date: "2024-03-01", amount: 50, proofUrl: "assets/gambar1.jpg" },
      { date: "2024-04-05", amount: 100, proofUrl: "assets/gambar2.jpg" },
    ],
  },
  rupiah: {
    loans: [
      { date: "2024-01-12", amount: 1000000 },
      { date: "2024-02-20", amount: 2500000 },
    ],
    payments: [
      {
        date: "2024-03-02",
        amount: 500000,
        proofUrl: "assets/gambar1.jpg",
      },
      {
        date: "2024-04-07",
        amount: 1000000,
        proofUrl: "assets/gambar2.jpg",
      },
    ],
  },
};

function formatDateToIndonesian(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
}

function populateTable(currency) {
  const loansTable = document.querySelector(`#${currency} .loans tbody`);
  const paymentsTable = document.querySelector(`#${currency} .payments tbody`);

  loansTable.innerHTML = data[currency].loans
    .map(
      (loan) => `
        <tr>
          <td>${formatDateToIndonesian(loan.date)}</td>
          <td>${currency === "dollar" ? "$" : "Rp"} ${
        currency === "dollar"
          ? loan.amount
          : loan.amount.toLocaleString("id-ID")
      }</td>
        </tr>
      `
    )
    .join("");

  paymentsTable.innerHTML = data[currency].payments
    .map(
      (payment) => `
        <tr>
          <td>${formatDateToIndonesian(payment.date)}</td>
          <td>${currency === "dollar" ? "$" : "Rp"} ${
        currency === "dollar"
          ? payment.amount
          : payment.amount.toLocaleString("id-ID")
      }</td>
          <td><img class="bukti" src="${
            payment.proofUrl
          }" alt="Bukti Pembayaran" /></td>
        </tr>
      `
    )
    .join("");
}

function calculateBalance(currency) {
  const loansTotal = data[currency].loans.reduce(
    (sum, loan) => sum + loan.amount,
    0
  );
  const paymentsTotal = data[currency].payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );
  return loansTotal - paymentsTotal;
}

function displayBalances() {
  const dollarBalance = calculateBalance("dollar");
  const rupiahBalance = calculateBalance("rupiah");

  const balanceContainer = document.createElement("div");
  balanceContainer.className = "balance-container";
  balanceContainer.innerHTML = `
    <h3>Saldo Akhir</h3>
    <p>Saldo Hutang Dolar: $${dollarBalance}</p>
    <p>Saldo Hutang Rupiah: Rp ${rupiahBalance.toLocaleString("id-ID")}</p>
  `;

  const container = document.querySelector(".container");
  container.appendChild(balanceContainer);
}

function showFullScreenImage(src) {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "1000";

  const img = document.createElement("img");
  img.src = src;
  img.style.maxWidth = "90%";
  img.style.maxHeight = "90%";
  img.style.boxShadow = "0 0 10px white";
  img.style.zIndex = "1001";
  img.addEventListener("click", (e) => e.stopPropagation());

  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.style.position = "absolute";
  closeButton.style.top = "20px";
  closeButton.style.right = "20px";
  closeButton.style.padding = "10px 20px";
  closeButton.style.backgroundColor = "red";
  closeButton.style.color = "white";
  closeButton.style.border = "none";
  closeButton.style.cursor = "pointer";
  closeButton.style.fontSize = "16px";
  closeButton.style.zIndex = "1002";
  closeButton.addEventListener("click", (e) => {
    e.stopPropagation();
    document.body.removeChild(overlay);
  });

  overlay.appendChild(img);
  overlay.appendChild(closeButton);
  overlay.addEventListener("click", () => document.body.removeChild(overlay));
  document.body.appendChild(overlay);
}

function attachImageClickHandlers() {
  document.querySelectorAll("img.bukti").forEach((img) => {
    img.style.cursor = "pointer";
    img.onclick = () => showFullScreenImage(img.src);
  });
}

window.onload = () => {
  populateTable("dollar");
  populateTable("rupiah");
  attachImageClickHandlers();
  displayBalances();
};
