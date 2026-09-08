const HEBREW_RE = /[֐-׿]/;

function renderLines(lines) {
  let html = "";
  let listOpen = false;

  const closeList = () => {
    if (listOpen) { html += "</ul>"; listOpen = false; }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    if (line.startsWith("## ")) {
      closeList();
      html += `<h3 class="sub">${escapeHtml(line.slice(3))}</h3>`;
    } else if (line.startsWith("- ")) {
      if (!listOpen) { html += "<ul>"; listOpen = true; }
      html += `<li>${escapeHtml(line.slice(2))}</li>`;
    } else if (line.startsWith("★")) {
      closeList();
      html += `<div class="highlight"><span class="badge">★ מומלץ</span>${escapeHtml(line.slice(1).trim())}</div>`;
    } else if (line.startsWith("🥾")) {
      closeList();
      html += `<div class="hike"><span class="badge">🥾 טיול</span>${escapeHtml(line.slice(2).trim())}</div>`;
    } else if (!HEBREW_RE.test(line)) {
      closeList();
      html += `<p class="en-caption">${escapeHtml(line)}</p>`;
    } else {
      closeList();
      html += `<p>${escapeHtml(line)}</p>`;
    }
  }
  closeList();
  return html;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function findTodayDay(days) {
  const today = todayISO();
  return days.find((d) => dayDateToISO(d.date) === today) || null;
}

function registerSW() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}
