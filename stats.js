// =========================
// СТАТИСТИКА ПИПЫ
// =========================

const total = Number(localStorage.getItem("totalClicks")) || 0;
const clicks = Number(localStorage.getItem("clicks")) || 0;
const record = Number(localStorage.getItem("record")) || 0;

// Звания
const ranks = [
    { clicks: 100000, title: "💎 Правая лапа Пипы" },
    { clicks: 10000, title: "🧹 Прислуга Пипы" },
    { clicks: 5000, title: "⭐ Легенда Пипы" },
    { clicks: 1000, title: "👑 Поклонник Королевы" },
    { clicks: 500, title: "🍎 Поставщик вкусняшек" },
    { clicks: 100, title: "🌾 Любитель чумизы" },
    { clicks: 1, title: "🐥 Знакомый Пипы" }
];

const rank = ranks.find(rank => total >= rank.clicks);
const rankTitle = rank ? rank.title : "🐣 Новичок";

// Вывод данных
document.getElementById("statsTotal").textContent = total;
document.getElementById("statsClicks").textContent = clicks;
document.getElementById("statsRecord").textContent = record;
document.getElementById("statsRank").textContent = rankTitle;
