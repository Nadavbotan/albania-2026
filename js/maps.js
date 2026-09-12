// Maps every place name that appears in the itinerary text (js/data.js) to a Google Maps
// search link. These are search-query links (not hardcoded pins) so Google resolves the
// best match — accurate for named landmarks, and each query includes the town/country for
// disambiguation. Left out entirely = not specific enough to search reliably (see README note
// / chat: "Communist-era bunkers" has no single named site in the trip doc, so it's skipped).

function mapsUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

const PLACE_LINKS = {
  "Skanderbeg Square": mapsUrl("Skanderbeg Square, Tirana, Albania"),
  "Blloku": mapsUrl("Blloku, Tirana, Albania"),
  "Grand Park (Parku i Liqenit)": mapsUrl("Grand Park of Tirana, Parku i Liqenit, Tirana, Albania"),
  "Drilon Springs": mapsUrl("Drilon Springs, Pogradec, Albania"),
  "Galičica National Park (road P504)": "https://en.mapy.cz/turisticka?planovani-trasy&x=20.8030955&y=40.9410112&z=14&rc=9wMl8wgzrXebp1-Zh5Khv1FNkda&rs=osm&rs=osm&rs=coor&rs=osm&ri=1096312104&ri=6426063&ri=&ri=1096312104&mrp=%7B%22c%22%3A132%7D&xc=%5B%5D",
  "Elbasan": "https://maps.app.goo.gl/mHjhRqejT8wKhxPF8",
  "Belshi Lake": "https://maps.app.goo.gl/CwR7ZnDNEWzk7fXo7",
  "wine window": "https://maps.app.goo.gl/ADfsiLoySjps68pA8",
  "פסטיבל סרטים ואומנות": "https://akt.gov.al/en/events-al/",
  "בית קפה שאמור להיות טוב לבוקר": "https://maps.app.goo.gl/DkUksg7LSXUUxGBu5?g_st=ipc",
  "מגדל קואלה": "https://maps.app.goo.gl/acK8EKK9UC9Zgq1k6",
  "Berat Castle (Kala) · the \"Big Head\" sculpture": mapsUrl("Berat Castle Kala, Berat, Albania"),
  "Rruga Petrit Lulo, 4 , Berat, Berat 5002": mapsUrl("Rruga Petrit Lulo 4, Berat, Albania"),
  "Vjosa-Narta Natural Area": mapsUrl("Vjosa-Narta Natural Area, Vlorë, Albania"),
  "St. Mary's Monastery, Narta Lagoon": mapsUrl("Zvernec Monastery, Vlorë, Albania"),
  "Narta Lagoon flamingo viewpoint": mapsUrl("Narta Lagoon, Vlorë, Albania"),
  "Caesar's Pass": "https://www.alltrails.com/trail/albania/vlore/caesar-s-pass-qafa-e-qezarit",
  "Porto Palermo Castle": mapsUrl("Porto Palermo Castle, Himara, Albania"),
  "Palermo Beach": mapsUrl("Palermo Beach, Himara, Albania"),
  "Potami Beach": mapsUrl("Potami Beach, Himara, Albania"),
  "Old Himara (Kastro) · Cafe Butterfly": mapsUrl("Old Himara Kastro, Himara, Albania"),
  "Spile promenade": mapsUrl("Spile Promenade, Himara, Albania"),
  "Lëkurësi Castle (above Saranda)": mapsUrl("Lëkurësi Castle, Saranda, Albania"),
  "Lori Beach": mapsUrl("Lori Beach, Ksamil, Albania"),
  "Butrint National Park (UNESCO)": mapsUrl("Butrint National Park, Albania"),
  "Vivari Channel cable ferry · Venetian Triangular Castle": mapsUrl("Triangle Castle Vivari Channel, Butrint, Albania"),
  "Ksamil Islands · launch from Beach 7": mapsUrl("Ksamil Beach 7, Ksamil, Albania"),
  "Mirror Beach (Pasqyra)": mapsUrl("Mirror Beach Pasqyra, Ksamil, Albania"),
  "Gjirokastër Castle": mapsUrl("Gjirokastër Castle, Albania"),
  "Old Bazaar": mapsUrl("Old Bazaar, Gjirokastër, Albania"),
  "Këlcyrë Gorge": mapsUrl("Këlcyrë Gorge, Albania"),
  "Durrës beach & promenade": mapsUrl("Durrës Beach Promenade, Albania"),
  "Durrës Roman Amphitheatre": mapsUrl("Durrës Amphitheatre, Albania"),
  "Kaneo": mapsUrl("Church of St John at Kaneo, Ohrid, North Macedonia"),
  "Beach Labino": mapsUrl("Labino Beach, Ohrid, North Macedonia"),
  "Ohrid Bazzar": mapsUrl("Ohrid Old Bazaar, Ohrid, North Macedonia")
};

// Sort keys longest-first so a longer phrase is matched before a shorter one it contains.
const PLACE_KEYS_SORTED = Object.keys(PLACE_LINKS).sort((a, b) => b.length - a.length);

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function linkifyPlaces(escapedHtml) {
  let html = escapedHtml;
  for (const key of PLACE_KEYS_SORTED) {
    const escapedKey = escapeHtml(key);
    if (!html.includes(escapedKey)) continue;
    const re = new RegExp(escapeRegExp(escapedKey), "g");
    html = html.replace(
      re,
      `<a class="place-link" href="${PLACE_LINKS[key]}" target="_blank" rel="noopener">${escapedKey} <span class="pin">📍</span></a>`
    );
  }
  return html;
}
