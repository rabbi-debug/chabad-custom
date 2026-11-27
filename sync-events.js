// NOTE (2026-11-26): The daily GitHub Action still runs this file (sync-events.js)
// because the Muse GitHub App cannot edit workflow files. The code below is the
// spreadsheet sync — the iCal sync it used to run has been retired. Identical copy
// is kept in sync-from-sheet.js.
// Sync the homepage "Next Upcoming Event" data from the Chabad Events Master Sheet.
// Since 2026-11-26 the source is NOT the ChabadOne iCal feed anymore.
// A separate public feed spreadsheet ("Chabad Frontpage Feed - Public") mirrors ONLY
// the homepage-safe fields of the master sheet via IMPORTRANGE+QUERY formulas, and is
// shared anyone-with-the-link so this script can read it as CSV. The master sheet
// itself stays private.
//
// Zalmy's frontpage rules, applied here and in live.js:
//   1) Active checkbox must be checked
//   2) Frontpage advertising checkbox must be checked
//      -> rules 1-2 are encoded here as removedFromFeed = NOT(active AND frontpage)
//   3) Next upcoming by start date, and 4) not in the past
//      -> live.js sorts by start and takes the first event that did not start
//         more than 4 hours ago; if none qualify it inserts NO card at all.
const fs = require('fs');

const FEED_CSV_URL = 'https://docs.google.com/spreadsheets/d/1FVhyfOv4QipsF9cSZ5--LYKVcBN4Ss4dsUFVKIVdy9s/export?format=csv&gid=0';
const DB_FILE = 'events.json';
const TZ = 'America/New_York';

function todayEastern() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

// Minimal RFC-4180 CSV parser (handles quotes, commas and newlines inside fields)
function parseCSV(str) {
  const rows = []; let row = [], field = '', inQ = false;
  for (let i = 0; i < str.length; i++) {
    const c = str[i], n = str[i + 1];
    if (inQ) {
      if (c === '"' && n === '"') { field += '"'; i++; }
      else if (c === '"') inQ = false;
      else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows;
}

async function main() {
  const res = await fetch(FEED_CSV_URL, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`Feed fetch failed: ${res.status} ${res.statusText}`);
  const csv = await res.text();
  const rows = parseCSV(csv);
  if (!rows.length || rows[0][0] !== 'Event ID') {
    throw new Error('Feed CSV does not look like the frontpage feed (first header is not "Event ID"). Aborting without changes.');
  }
  const hdr = {}; rows[0].forEach((h, i) => { hdr[h.trim()] = i; });
  const get = (r, name) => { const i = hdr[name]; return i == null ? '' : String(r[i] == null ? '' : r[i]).trim(); };
  const isTrue = v => String(v).trim().toUpperCase() === 'TRUE';
  const today = todayEastern();

  // Preserve firstSeen for events already in the current events.json
  let existing = {};
  if (fs.existsSync(DB_FILE)) {
    try { existing = JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); } catch (e) { existing = {}; }
  }

  const db = {};
  for (const r of rows.slice(1)) {
    const id = get(r, 'Event ID');
    if (!id) continue;
    const active = isTrue(get(r, 'Active'));
    const front = isTrue(get(r, 'Frontpage advertising'));
    const locName = get(r, 'Location Name'), locAddr = get(r, 'Location Address');
    db[id] = {
      uid: id,
      title: get(r, 'Event Name'),
      description: get(r, 'Event Description'),
      flyer: get(r, 'Flyer Image Link') || get(r, 'Main Image Link'),
      signUp: get(r, 'RSVP / Registration Form Link') || get(r, 'Event Link (Website)'),
      start: get(r, 'Start DateTime (ISO 8601)'),
      end: get(r, 'End DateTime (ISO 8601)'),
      location: locAddr ? (locName + ' - ' + locAddr) : locName,
      firstSeen: (existing[id] && existing[id].firstSeen) || today,
      lastSeen: today,
      removedFromFeed: !(active && front)
    };
  }
  if (Object.keys(db).length === 0) {
    throw new Error('Feed parsed but contained no events with an Event ID. Aborting without changes.');
  }
  const sorted = {};
  Object.keys(db).sort((a, b) => String(db[a].start).localeCompare(String(db[b].start))).forEach(k => { sorted[k] = db[k]; });
  fs.writeFileSync(DB_FILE, JSON.stringify(sorted, null, 2));
  console.log(`Synced ${Object.keys(sorted).length} events from the sheet feed.`);
}
main().catch(err => { console.error('Error syncing from sheet:', err); process.exit(1); });
