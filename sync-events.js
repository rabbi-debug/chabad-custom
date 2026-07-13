const fs = require('fs');
const ical = require('node-ical');

// Chabad One iCal export feed (HTTPS)
const ICAL_URL = 'https://www.chabadwhiteplains.com/templates/eventexport.asp?mid=11728';
const DB_FILE = 'events.json';
const TZ = 'America/New_York';

/* Convert a Date (or date string) to an ISO string in Eastern time,
   e.g. "2026-07-10T19:30:00-04:00" — human-readable AND unambiguous. */
function toEastern(d) {
  if (!d) return "";
  const date = (d instanceof Date) ? d : new Date(d);
  if (isNaN(date.getTime())) return String(d);
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false
  }).formatToParts(date).reduce((acc, p) => (acc[p.type] = p.value, acc), {});
  const hour = parts.hour === '24' ? '00' : parts.hour;
  const asUTC = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +hour, +parts.minute, +parts.second);
  const offsetMin = Math.round((asUTC - date.getTime()) / 60000);
  const sign = offsetMin >= 0 ? '+' : '-';
  const abs = Math.abs(offsetMin);
  const oh = String(Math.floor(abs / 60)).padStart(2, '0');
  const om = String(abs % 60).padStart(2, '0');
  return `${parts.year}-${parts.month}-${parts.day}T${hour}:${parts.minute}:${parts.second}${sign}${oh}:${om}`;
}

/* Today's date (YYYY-MM-DD) in Eastern time, for firstSeen/lastSeen */
function todayEastern() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(new Date());
}

async function syncEvents() {
  let db = {};

  // 1. Load the existing database. If it exists but is corrupted, STOP —
  //    never overwrite the archive with a fresh empty one.
  if (fs.existsSync(DB_FILE)) {
    const rawData = fs.readFileSync(DB_FILE, 'utf8');
    if (rawData.trim() !== "") {
      try {
        db = JSON.parse(rawData);
      } catch (e) {
        console.error("FATAL: events.json exists but could not be parsed. " +
          "Refusing to continue so the archive is not overwritten. " +
          "Fix or restore the file from Git history, then re-run.");
        process.exit(1);
      }
    }
  }

  console.log('Fetching calendar data...');

  // 2. Fetch the feed
  const response = await fetch(ICAL_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch calendar: ${response.status} ${response.statusText}`);
  }

  const icsData = await response.text();
  console.log(`Received ${icsData.length} characters of calendar data.`);

  // Sanity check: make sure this is actually an iCal file, not an error page
  if (!icsData.includes('BEGIN:VCALENDAR')) {
    throw new Error('Downloaded data does not look like an iCal feed (no BEGIN:VCALENDAR). Aborting without changes.');
  }

  // 3. Parse the iCal data
  const webEvents = await ical.async.parseICS(icsData);

  const today = todayEastern();
  const seenThisRun = new Set();
  let count = 0;

  // 4. Merge feed events into the database
  for (const key in webEvents) {
    if (!webEvents.hasOwnProperty(key)) continue;
    const ev = webEvents[key];
    if (ev.type !== 'VEVENT') continue;

    // Fix Title object issue (handles QUOTED-PRINTABLE objects from Chabad One)
    let titleStr = "No Title";
    if (ev.summary) {
      titleStr = (typeof ev.summary === 'object' && ev.summary.val) ? ev.summary.val : String(ev.summary);
    }

    let rawDesc = ev.description || "";
    // Clean up backslashes that Chabad One's exporter adds (e.g. "Sign Up\: https\:\/\/...")
    rawDesc = rawDesc.replace(/\\/g, '');

    let flyerUrl = "";
    let signUpUrl = "";

    // --- THE SCANNER ---
    // Hunt for Flyer link (matching up to a space or an HTML tag like <BR>)
    const flyerMatch = rawDesc.match(/Flyer:\s*(https?:\/\/[^\s<]+)/i);
    if (flyerMatch) {
      flyerUrl = flyerMatch[1];
      rawDesc = rawDesc.replace(flyerMatch[0], "").trim();
    }

    // Hunt for either "Sign Up:" OR "More Info:" and save to signUpUrl
    const signUpMatch = rawDesc.match(/(?:Sign Up|More Info):\s*(https?:\/\/[^\s<]+)/i);
    if (signUpMatch) {
      signUpUrl = signUpMatch[1];
      rawDesc = rawDesc.replace(signUpMatch[0], "").trim();
    }

    // Clean up trailing/excess <BR> tags
    rawDesc = rawDesc.replace(/(?:<br\s*\/?>\s*)+$/i, '').trim();
    rawDesc = rawDesc.replace(/(?:<br\s*\/?>\s*){3,}/ig, '<BR><BR>').trim();

    const existing = db[ev.uid] || {};
    db[ev.uid] = {
      uid: ev.uid,
      title: titleStr,
      description: rawDesc,
      flyer: flyerUrl,
      signUp: signUpUrl,
      start: toEastern(ev.start),
      end: toEastern(ev.end),
      location: ev.location || "",
      firstSeen: existing.firstSeen || today,   // preserved across updates
      lastSeen: today,                          // updated every time it appears
      removedFromFeed: false
    };
    seenThisRun.add(ev.uid);
    count++;
  }

  // 5. History pass: mark events that are no longer on the feed (never delete),
  //    backfill metadata on old records, and convert any legacy UTC timestamps.
  for (const uid in db) {
    if (!db.hasOwnProperty(uid)) continue;
    const rec = db[uid];
    if (!rec.firstSeen) rec.firstSeen = rec.lastSeen || today;
    if (!rec.lastSeen) rec.lastSeen = today;
    if (!seenThisRun.has(uid)) {
      rec.removedFromFeed = true;   // kept forever, just flagged
    }
    // Convert legacy "...Z" (UTC) timestamps to Eastern for consistency
    if (typeof rec.start === 'string' && rec.start.endsWith('Z')) rec.start = toEastern(rec.start);
    if (typeof rec.end === 'string' && rec.end.endsWith('Z')) rec.end = toEastern(rec.end);
  }

  // 6. Save everything back, sorted by start date for readable diffs
  const sorted = {};
  Object.keys(db)
    .sort((a, b) => String(db[a].start).localeCompare(String(db[b].start)))
    .forEach(k => { sorted[k] = db[k]; });

  fs.writeFileSync(DB_FILE, JSON.stringify(sorted, null, 2));
  console.log(`Synced ${count} events from the feed; archive now holds ${Object.keys(sorted).length} total.`);
}

syncEvents().catch(err => {
  console.error("Error syncing events:", err);
  process.exit(1);
});
