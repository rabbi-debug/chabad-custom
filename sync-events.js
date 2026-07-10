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
  
  // 2. Fetch the data using modern native fetch
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
        // Fix Title object issue (handles QUOTED-PRINTABLE objects from Chabad One)
        let titleStr = "No Title";
        if (ev.summary) {
          if (typeof ev.summary === 'object' && ev.summary.val) {
            titleStr = ev.summary.val;
          } else {
            titleStr = String(ev.summary);
          }
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

        // Hunt for either "Sign Up:" OR "More Info:" and save to signUpUrl (up to a space or HTML tag)
        const signUpMatch = rawDesc.match(/(?:Sign Up|More Info):\s*(https?:\/\/[^\s<]+)/i);
        if (signUpMatch) {
          signUpUrl = signUpMatch[1];
          rawDesc = rawDesc.replace(signUpMatch[0], "").trim();
        }

        // Clean up any trailing <BR> tags left at the end of the description after parsing
        rawDesc = rawDesc.replace(/(?:<br\s*\/?>\s*)+$/i, '').trim();
        // Clean up any double/triple spacing or excess <BR> tags in the middle
        rawDesc = rawDesc.replace(/(?:<br\s*\/?>\s*){3,}/ig, '<BR><BR>').trim();

        // Save the neatly separated data
        db[ev.uid] = {
          uid: ev.uid,
          title: titleStr,
          description: rawDesc,
          flyer: flyerUrl,
          signUp: signUpUrl,
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
