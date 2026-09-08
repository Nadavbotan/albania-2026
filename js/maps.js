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
  "Galičica National Park (road P504)": mapsUrl("Galičica National Park, North Macedonia"),
  "Elbasan": mapsUrl("Elbasan, Albania"),
  "Belshi Lake": mapsUrl("Belsh Lake, Albania"),
  "Berat Castle (Kala) · the \"Big Head\" sculpture": mapsUrl("Berat Castle Kala, Berat, Albania"),
  "Rruga Petrit Lulo, 4 , Berat, Berat 5002": mapsUrl("Rruga Petrit Lulo 4, Berat, Albania"),
  "Vjosa-Narta Natural Area": mapsUrl("Vjosa-Narta Natural Area, Vlorë, Albania"),
  "St. Mary's Monastery, Narta Lagoon": mapsUrl("Zvernec Monastery, Vlorë, Albania"),
  "Narta Lagoon flamingo viewpoint": mapsUrl("Narta Lagoon, Vlorë, Albania"),
  "Caesar's Pass": mapsUrl("Caesar's Pass Trail, Llogara, Albania"),
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
