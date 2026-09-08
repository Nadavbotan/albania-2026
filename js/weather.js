// Weather via Open-Meteo (free, no API key). Forecasts land ~16 days ahead;
// earlier than that we show a "check back later" state. Cached in localStorage for offline PWA use.

const WEATHER_CODES = {
  0: { icon: "☀️", label: "בהיר" },
  1: { icon: "🌤️", label: "בהיר בעיקרו" },
  2: { icon: "⛅", label: "מעונן חלקית" },
  3: { icon: "☁️", label: "מעונן" },
  45: { icon: "🌫️", label: "ערפל" },
  48: { icon: "🌫️", label: "ערפל קפוא" },
  51: { icon: "🌦️", label: "טפטוף קל" },
  53: { icon: "🌦️", label: "טפטוף" },
  55: { icon: "🌧️", label: "טפטוף חזק" },
  61: { icon: "🌧️", label: "גשם קל" },
  63: { icon: "🌧️", label: "גשם" },
  65: { icon: "🌧️", label: "גשם חזק" },
  71: { icon: "🌨️", label: "שלג קל" },
  73: { icon: "🌨️", label: "שלג" },
  75: { icon: "❄️", label: "שלג חזק" },
  80: { icon: "🌦️", label: "מקלחות קלות" },
  81: { icon: "🌧️", label: "מקלחות" },
  82: { icon: "⛈️", label: "מקלחות חזקות" },
  95: { icon: "⛈️", label: "סופת רעמים" },
  96: { icon: "⛈️", label: "סופת רעמים עם ברד" },
  99: { icon: "⛈️", label: "סופת רעמים עם ברד" }
};

function weatherCodeInfo(code) {
  return WEATHER_CODES[code] || { icon: "🌡️", label: "" };
}

async function getWeatherForDay(day) {
  const cacheKey = `wx-${day.date}-${day.lat}-${day.lon}`;
  const cached = localStorage.getItem(cacheKey);
  const cachedData = cached ? JSON.parse(cached) : null;

  if (!navigator.onLine && cachedData) return cachedData;

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${day.lat}&longitude=${day.lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode&timezone=auto&forecast_days=16`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("weather fetch failed");
    const json = await res.json();

    const targetDate = dayDateToISO(day.date);
    const idx = json.daily.time.indexOf(targetDate);

    if (idx === -1) {
      return cachedData || { available: false };
    }

    const result = {
      available: true,
      max: Math.round(json.daily.temperature_2m_max[idx]),
      min: Math.round(json.daily.temperature_2m_min[idx]),
      pop: json.daily.precipitation_probability_max[idx],
      code: json.daily.weathercode[idx],
      fetchedAt: Date.now()
    };
    localStorage.setItem(cacheKey, JSON.stringify(result));
    return result;
  } catch (e) {
    return cachedData || { available: false };
  }
}

function dayDateToISO(ddmm) {
  const [day, month] = ddmm.split(".");
  return `2026-${month}-${day}`;
}

function renderWeather(container, day) {
  container.innerHTML = `<div class="wx wx-loading">בודק תחזית…</div>`;
  getWeatherForDay(day).then((wx) => {
    if (!wx || !wx.available) {
      container.innerHTML = `<div class="wx wx-empty">התחזית תופיע כשנתקרב לתאריך (עד 16 יום מראש) 📅</div>`;
      return;
    }
    const info = weatherCodeInfo(wx.code);
    container.innerHTML = `
      <div class="wx">
        <span class="wx-icon">${info.icon}</span>
        <span class="wx-temps"><b>${wx.max}°</b> / ${wx.min}°</span>
        <span class="wx-label">${info.label}</span>
        ${wx.pop != null ? `<span class="wx-pop">💧 ${wx.pop}%</span>` : ""}
      </div>`;
  });
}
