const fs = require('fs');
const ical = require('node-ical');

// Switched to HTTPS for a secure connection
const ICAL_URL = 'https://www.chabadwhiteplains.com/templates/eventexport.asp?mid=11728';
const DB_FILE = 'events.json';

async function syncEvents() {
  let db = {};
  
  // 1. Load the existing database if it exists
  if (fs.existsSync(DB_FILE)) {
    try {
      const rawData = fs.readFileSync(DB_FILE, 'utf8');
      if (rawData.trim() !== "") {
        db = JSON.parse(rawData);
      }
    } catch (e) {
      console.log("Could not parse existing database, starting a fresh one.");
    }
  }

  console.log('Fetching calendar data...');
  
  // 2. Fetch the data using modern native fetch with a User-Agent header
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
  
  // 3. Parse the iCal data
  const webEvents = await ical.async.parseICS(icsData);

  // 4. Process and add events to the database
  let count = 0;
  for (const key in webEvents) {
    if (webEvents.hasOwnProperty(key)) {
      const ev = webEvents[key];
      
      if (ev.type === 'VEVENT') {
        let rawDesc = ev.description || "";
        let flyerUrl = "";
        let signUpUrl = ""; // This will hold either "Sign Up" OR "More Info" links

        // --- THE SCANNER ---
        // Hunt for Flyer link and remove it from description
        const flyerMatch = rawDesc.match(/Flyer:\s*(https?:\/\/[^\s]+)/i);
        if (flyerMatch) {
          flyerUrl = flyerMatch[1];
          rawDesc = rawDesc.replace(flyerMatch[0], "").trim();
        }

        // Hunt for either "Sign Up:" OR "More Info:" and save it to the same signUp data point
        const signUpMatch = rawDesc.match(/(?:Sign Up|More Info):\s*(https?:\/\/[^\s]+)/i);
        if (signUpMatch) {
          signUpUrl = signUpMatch[1];
          rawDesc = rawDesc.replace(signUpMatch[0], "").trim();
        }

        // Clean up any weird double-spacing left behind by the removal
        rawDesc = rawDesc.replace(/[\r\n]{3,}/g, '\n\n').trim();

        // Save the neatly separated data
        db[ev.uid] = {
          uid: ev.uid,
          title: ev.summary || "No Title",
          description: rawDesc,
          flyer: flyerUrl,
          signUp: signUpUrl, // Populated whether you write "Sign Up" or "More Info"
          start: ev.start,
          end: ev.end,
          location: ev.location || ""
        };
        count++;
      }
    }
  }

  // 5. Save everything back to the events.json file
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  console.log(`Successfully synced ${count} new/updated events into the database.`);
}

syncEvents().catch(err => {
  console.error("Error syncing events:", err);
  process.exit(1);
});
