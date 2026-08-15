"use strict";

// ===============================
// 1. SELECT ELEMENTS
// ===============================

const themeBtn = document.getElementById("themeBtn");

const amountInput = document.getElementById("amountInput");
const amountSymbol = document.getElementById("amountSymbol");

const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");

const fromFlag = document.getElementById("fromFlag");
const toFlag = document.getElementById("toFlag");

const swapBtn = document.getElementById("swapBtn");

const fromAmountText = document.getElementById("fromAmountText");
const convertedAmount = document.getElementById("convertedAmount");
const exchangeRateText = document.getElementById("exchangeRateText");

const convertBtn = document.getElementById("convertBtn");
const resetBtn = document.getElementById("resetBtn");

// ===============================
// 2. STATE
// ===============================

let fromCurrencyCode = "EUR";

let toCurrencyCode = "USD";

// ===============================
// 3. CURRENCY DATA
// ===============================

const currencyData = {
  EUR: {
    symbol: "€",
    flag: "🇪🇺",
  },

  USD: {
    symbol: "$",
    flag: "🇺🇸",
  },

  GBP: {
    symbol: "£",
    flag: "🇬🇧",
  },

  CHF: {
    symbol: "CHF",
    flag: "🇨🇭",
  },

  CZK: {
    symbol: "Kč",
    flag: "🇨🇿",
  },

  PLN: {
    symbol: "zł",
    flag: "🇵🇱",
  },
};

// ===============================
// 4. GET EXCHANGE RATE
// ===============================

async function getExchangeRate() {
  if (fromCurrencyCode === toCurrencyCode) {
    return 1;
  }

  const url = `https://api.frankfurter.dev/v2/rate/${fromCurrencyCode}/${toCurrencyCode}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rate");
    }

    const data = await response.json();

    return data.rate;
  } catch (error) {
    console.error("Exchange rate error:", error);

    return null;
  }
}

// ===============================
// 5. CONVERT CURRENCY
// ===============================

async function convertCurrency() {
  const amount = Number(amountInput.value);

  if (!amount || amount <= 0) {
    updateResult(0, 0, 0);

    return;
  }

  const rate = await getExchangeRate();

  if (rate === null) return;

  const converted = amount * rate;

  updateResult(amount, converted, rate);
}

// ===============================
// 6. SWAP CURRENCIES
// ===============================

function swapCurrencies() {
  const tempCurrency = fromCurrencyCode;

  fromCurrencyCode = toCurrencyCode;
  toCurrencyCode = tempCurrency;

  fromCurrency.value = fromCurrencyCode;
  toCurrency.value = toCurrencyCode;

  updateCurrencyUI();
  convertCurrency();
}

// ===============================
// 7. UPDATE CURRENCY UI
// ===============================

function updateCurrencyUI() {
  amountSymbol.textContent = currencyData[fromCurrencyCode].symbol;

  fromFlag.textContent = currencyData[fromCurrencyCode].flag;

  toFlag.textContent = currencyData[toCurrencyCode].flag;
}

// ===============================
// 8. UPDATE RESULT
// ===============================

function updateResult(amount, converted, rate) {
  fromAmountText.textContent = `${amount.toFixed(2)} ${fromCurrencyCode}`;

  convertedAmount.textContent = `${converted.toFixed(2)} ${toCurrencyCode}`;

  exchangeRateText.textContent = `1 ${fromCurrencyCode} = ${rate.toFixed(4)} ${toCurrencyCode}`;
}

// ===============================
// 9. RESET CONVERTER
// ===============================

function resetConverter() {
  amountInput.value = "";

  fromCurrencyCode = "EUR";
  toCurrencyCode = "USD";

  fromCurrency.value = fromCurrencyCode;
  toCurrency.value = toCurrencyCode;

  updateCurrencyUI();

  fromAmountText.textContent = "0.00 EUR";
  convertedAmount.textContent = "0.00 USD";
  exchangeRateText.textContent = "1 EUR = 0.00 USD";
}

// ===============================
// 10. TOGGLE THEME
// ===============================

function toggleTheme() {
  document.body.classList.toggle("dark-theme");

  const isDarkMode = document.body.classList.contains("dark-theme");

  localStorage.setItem("currencyConverterTheme", isDarkMode);

  themeBtn.innerHTML = isDarkMode
    ? `<i data-lucide="sun"></i>`
    : `<i data-lucide="moon"></i>`;

  lucide.createIcons();
}

// ===============================
// 11. LOAD THEME
// ===============================

function loadTheme() {
  const isDarkMode = localStorage.getItem("currencyConverterTheme") === "true";

  if (isDarkMode) {
    document.body.classList.add("dark-theme");
  }

  themeBtn.innerHTML = isDarkMode
    ? `<i data-lucide="sun"></i>`
    : `<i data-lucide="moon"></i>`;

  lucide.createIcons();
}

// ===============================
// 12. EVENT LISTENERS
// ===============================

amountInput.addEventListener("input", convertCurrency);

fromCurrency.addEventListener("change", () => {
  fromCurrencyCode = fromCurrency.value;

  updateCurrencyUI();
  convertCurrency();
});

toCurrency.addEventListener("change", () => {
  toCurrencyCode = toCurrency.value;

  updateCurrencyUI();
  convertCurrency();
});

swapBtn.addEventListener("click", swapCurrencies);

convertBtn.addEventListener("click", convertCurrency);

resetBtn.addEventListener("click", resetConverter);

themeBtn.addEventListener("click", toggleTheme);

// ===============================
// 13. INITIALIZE APP
// ===============================

loadTheme();
updateCurrencyUI();
updateResult(0, 0, 0);

lucide.createIcons();
