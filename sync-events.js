const fs = require('fs');
const ical = require('node-ical');

const ICAL_URL = 'http://www.chabadwhiteplains.com/calendar/view/eventexport_cdo/cid/70CB8844-2204-4807-BC79-07E424B2A95A';
const DB_FILE = 'events.json';

async function syncEvents() {
  let db = {};
  
  // 1. Load the existing database if it exists
  if (fs.existsSync(DB_FILE)) {
    const rawData = fs.readFileSync(DB_FILE);
    try {
      db = JSON.parse(rawData);
    } catch (e) {
      console.log("Starting a fresh database.");
    }
  }

  // 2. Fetch the latest events from the Chabad calendar
  console.log('Fetching calendar data...');
  const webEvents = await ical.async.fromURL(ICAL_URL);

  // 3. Process and add events to the database
  let count = 0;
  for (const key in webEvents) {
    if (webEvents.hasOwnProperty(key)) {
      const ev = webEvents[key];
      
      // We only want actual calendar events
      if (ev.type === 'VEVENT') {
        db[ev.uid] = {
          uid: ev.uid,
          title: ev.summary,
          description: ev.description || "",
          start: ev.start,
          end: ev.end,
          location: ev.location || ""
        };
        count++;
      }
    }
  }

  // 4. Save everything back to the events.json file
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  console.log(`Successfully synced ${count} events into the database.`);
}

syncEvents().catch(err => {
  console.error("Error syncing events:", err);
  process.exit(1);
});
