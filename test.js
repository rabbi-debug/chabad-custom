/* ============================================================
   TEST scripts — only run in preview mode (bookmarklet ON).
   Visitors never load this file.
   Note: in preview mode this file REPLACES live.js, so it
   should mirror live.js plus whatever is being tested.
   ============================================================ */

var CC_ENABLED = true;

(function () {
  if (!CC_ENABLED) return;

  var PAGE_TYPES = {
    "6072929": "info",
    "6528138": "info"
  };

  var m = location.pathname.match(/\/aid\/(\d+)\//);
  var aid = m ? m[1] : null;
  var type = (aid && PAGE_TYPES[aid]) || null;
  if (!type && /(^|\s)form(\s|$)/.test(document.body.className)) type = "form";
  if (!type && (location.pathname === "/" || /^\/default\.asp/i.test(location.pathname))) type = "home";
  if (type) document.documentElement.className += " cc-type-" + type;

  try { console.log("[chabad-custom] test.js loaded (PREVIEW MODE)", { aid: aid, type: type }); } catch (e) {}

  function onPage(id, fn) { if (aid === String(id)) fn(); }
  function onType(t, fn) { if (type === t) fn(); }

  /* ============================================
     Experiments go below this line
     ============================================ */

  /* --- Footer Text Formatting --- */
  // Wrap in a small timeout to ensure ChabadOne's scripts have finished rendering the footer
  setTimeout(function() {
    var footerEl = document.querySelector('#footer .footer3') || document.querySelector('#footer .bottom_padding');
    
    if (footerEl) {
      var content = footerEl.innerHTML;
      // Using a highly flexible regex to catch the string regardless of spacing or dashes
      var targetRegex = /Chabad of White Plains[\s\S]*?White Plains,\s*NY[\s\S]*?914-998-6724/i;
      
      if (targetRegex.test(content)) {
        var newFooterText = '<div class="cc-foot-place">Chabad of White Plains</div>' +
                            '<div class="cc-foot-phone">White Plains, NY &bull; <a href="tel:914-998-6724">914-998-6724</a></div>';
        
        footerEl.innerHTML = content.replace(targetRegex, newFooterText);
      }
    }
  }, 100);

  /* --- 2) Dynamic Upcoming Event Widget --- */
  (function() {
    // Look for native homepage layout row first, fallback to the manual placeholder if needed
    var homepageTarget = document.querySelector('.hp_content_wrapper');
    var manualPlaceholder = document.getElementById('cc-upcoming-event-placeholder');
    
    // If neither element is present on this page, exit early to minimize tracking footprint
    if (!homepageTarget && !manualPlaceholder) return;

    // Fetch the automated events database from GitHub Pages
    var dbUrl = 'https://rabbi-debug.github.io/chabad-custom/events.json';

    fetch(dbUrl)
      .then(function(res) { return res.json(); })
      .then(function(events) {
        var now = new Date();
        var futureEvents = [];

        // Convert events object to array & filter out past events
        for (var key in events) {
          if (events.hasOwnProperty(key)) {
            var ev = events[key];
            var eventEnd = ev.end ? new Date(ev.end) : new Date(ev.start);
            if (eventEnd >= now) {
              futureEvents.push(ev);
            }
          }
        }

        // Sort events so the closest upcoming one is first
        futureEvents.sort(function(a, b) {
          return new Date(a.start) - new Date(b.start);
        });

        var nextEvent = futureEvents[0];
        if (!nextEvent) {
          if (manualPlaceholder) {
            manualPlaceholder.innerHTML = '<div class="cc-no-events">Check back soon for upcoming events!</div>';
          }
          return;
        }

        // Format Date and Time nicely
        var startDt = new Date(nextEvent.start);
        var dateOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
        var timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
        
        var dateStr = startDt.toLocaleDateString('en-US', dateOptions);
        var timeStr = startDt.toLocaleTimeString('en-US', timeOptions);

        // Build HTML layout
        var html = '<div class="cc-event-card">';
        
        if (nextEvent.flyer) {
          html += '<div class="cc-event-image-wrap">' +
                    '<img src="' + nextEvent.flyer + '" alt="' + nextEvent.title + '" class="cc-event-flyer" />' +
                  '</div>';
        }
        
        html += '<div class="cc-event-details">';
        html += '  <span class="cc-event-tag">UPCOMING EVENT</span>';
        html += '  <h2 class="cc-event-title">' + nextEvent.title + '</h2>';
        html += '  <div class="cc-event-meta">';
        html += '    <div class="cc-meta-item"><strong>Date:</strong> ' + dateStr + '</div>';
        html += '    <div class="cc-meta-item"><strong>Time:</strong> ' + timeStr + '</div>';
        if (nextEvent.location) {
          html += '    <div class="cc-meta-item"><strong>Location:</strong> ' + nextEvent.location.split(' - ')[0] + '</div>';
        }
        html += '  </div>';
        html += '  <div class="cc-event-desc">' + nextEvent.description + '</div>';
        
        if (nextEvent.signUp) {
          html += '  <a href="' + nextEvent.signUp + '" class="cc-event-btn" target="_blank">Register / More Info</a>';
        }
        
        html += '</div></div>';

        // Determine where to output layout natively
        if (homepageTarget) {
          // Wrap inside a structural layout row matching Chabad One's framework
          var rowWrapperHtml = '<div class="hp-row cc-automated-event-row">' + html + '</div>';
          homepageTarget.insertAdjacentHTML('beforebegin', rowWrapperHtml);
        } else if (manualPlaceholder) {
          manualPlaceholder.innerHTML = html;
        }
      })
      .catch(function(err) {
        console.error('[chabad-custom] Failed to load upcoming event:', err);
      });
  })();
})();
