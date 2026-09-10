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
      html += `<li>${linkifyPlaces(escapeHtml(line.slice(2)))}</li>`;
    } else if (line.startsWith("★")) {
      closeList();
      html += `<div class="highlight"><span class="badge">★ מומלץ</span>${linkifyPlaces(escapeHtml(line.slice(1).trim()))}</div>`;
    } else if (line.startsWith("🥾")) {
      closeList();
      html += `<div class="hike"><span class="badge">🥾 טיול</span>${linkifyPlaces(escapeHtml(line.slice(2).trim()))}</div>`;
    } else if (!HEBREW_RE.test(line)) {
      closeList();
      html += `<p class="en-caption">${linkifyPlaces(escapeHtml(line))}</p>`;
    } else {
      closeList();
      html += `<p>${linkifyPlaces(escapeHtml(line))}</p>`;
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

function platformBadge(lodgingType) {
  if (lodgingType === "Booking") return `<span class="platform-badge platform-booking">🅱️ Booking</span>`;
  if (lodgingType === "Airbnb") return `<span class="platform-badge platform-airbnb">🏠 Airbnb</span>`;
  return "";
}

function renderLodgingBottom(day) {
  if (!day.lodgingAddress) return "";
  return `
    <div class="lodging-bottom">
      <div class="lodging-bottom-header">
        ${platformBadge(day.lodgingType)}
        <span class="lodging-name">${escapeHtml(day.lodging)}</span>
      </div>
      <div class="lodging-bottom-address">
        <span class="address-text">${escapeHtml(day.lodgingAddress)}</span>
        <button class="copy-btn" type="button" data-copy="${escapeHtml(day.lodgingAddress)}" aria-label="העתק כתובת" title="העתק כתובת">📋</button>
      </div>
    </div>`;
}

function initCopyButtons(root) {
  root.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.getAttribute("data-copy");
      try {
        await navigator.clipboard.writeText(text);
      } catch (e) {
        return;
      }
      const original = btn.textContent;
      btn.textContent = "✓";
      btn.classList.add("copied");
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove("copied");
      }, 1200);
    });
  });
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
  if (!("serviceWorker" in navigator)) return;

  // Reload once, automatically, as soon as a new service worker takes control —
  // so updates show up without the user needing to manually clear cache.
  let reloaded = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (reloaded) return;
    reloaded = true;
    location.reload();
  });

  navigator.serviceWorker.register("sw.js").then((reg) => {
    reg.update().catch(() => {});
    if (reg.waiting) reg.waiting.postMessage("skipWaiting");
    reg.addEventListener("updatefound", () => {
      const nw = reg.installing;
      if (!nw) return;
      nw.addEventListener("statechange", () => {
        if (nw.state === "installed" && navigator.serviceWorker.controller) {
          nw.postMessage("skipWaiting");
        }
      });
    });
  }).catch(() => {});
}
