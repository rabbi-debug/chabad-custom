/* ============================================================
   chabadwhiteplains.com — LIVE scripts (all visitors see this)
   Loaded on every page by the footer snippet.
   ============================================================ */

var CC_ENABLED = true; /* KILL SWITCH: set to false to disable ALL customizations site-wide */

(function () {
  if (!CC_ENABLED) {
    /* Remove the injected stylesheet(s) so the site returns to stock */
    var links = document.querySelectorAll('link[href*="rabbi-debug.github.io/chabad-custom"]');
    for (var i = 0; i < links.length; i++) links[i].parentNode.removeChild(links[i]);
    return;
  }

  /* ---- Page registry: aid number -> page type (manual overrides) ---- */
  var PAGE_TYPES = {
    "6072929": "info", /* About */
    "6528138": "info"  /* Kosher Explained */
  };

  /* ---- Identify the current page ---- */
  var m = location.pathname.match(/\/aid\/(\d+)\//);
  var aid = m ? m[1] : null;
  var type = (aid && PAGE_TYPES[aid]) || null;

  /* Auto-detect form pages: Chabad One puts a "form" class on <body>
     of every form page, so new forms are recognized automatically. */
  if (!type && /(^|\s)form(\s|$)/.test(document.body.className)) type = "form";

  /* Auto-detect the homepage (no aid in URL) */
  if (!type && (location.pathname === "/" || /^\/default\.asp/i.test(location.pathname))) type = "home";

  if (type) document.documentElement.className += " cc-type-" + type;

  /* Proof-of-life message (visible in the browser console) */
  try { console.log("[chabad-custom] live.js loaded", { aid: aid, type: type }); } catch (e) {}

  /* ---- Helpers for page-specific JS ---- */
  function onPage(id, fn) { if (aid === String(id)) fn(); }
  function onType(t, fn) { if (type === t) fn(); }

  /* ============================================
     Customizations go below this line
     ============================================ */
/* --- Footer Text Formatting --- */
  setTimeout(function() {
    var footerEl = document.querySelector('#footer .footer3') || document.querySelector('#footer .bottom_padding');
    
    if (footerEl) {
      var content = footerEl.innerHTML;
      var targetRegex = /Chabad of White Plains[\s\S]*?White Plains,\s*NY[\s\S]*?914-998-6724/i;
      
      if (targetRegex.test(content)) {
        var newFooterText = '<div class="cc-foot-place">Chabad of White Plains</div>' +
                            '<div class="cc-foot-phone">White Plains, NY &bull; <a href="tel:914-998-6724">914-998-6724</a></div>';
        
        footerEl.innerHTML = content.replace(targetRegex, newFooterText);
      }
    }
  }, 100);

  /* --- EXPERIMENT (TEST ONLY): "Upcoming Events" homepage section ---
     Inserted between the About and Programs sections. Reads events from
     the calendar archive (events.json) maintained by the daily GitHub
     sync, and repaints the homepage's alternating white/gray bands so
     the rhythm stays intact after the new section is added. */
  (function () {
    if (type !== "home") return;

    var JSON_URL = "https://rabbi-debug.github.io/chabad-custom/events.json";
    var isPreview = /(^|\s)cc-preview(\s|$)/.test(document.documentElement.className);

    function esc(s) {
      return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    }

    function fmtDate(iso) {
      var d = new Date(iso);
      if (isNaN(d.getTime())) return "";
      try {
        var day = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "long", month: "long", day: "numeric" }).format(d);
        var time = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", hour: "numeric", minute: "2-digit" }).format(d);
        return day + " \u00b7 " + time;
      } catch (e) { return d.toLocaleString(); }
    }

    function visibleBg(el) {
      var c = window.getComputedStyle(el).backgroundColor;
      if (!c || c === "transparent" || c === "rgba(0, 0, 0, 0)") return null;
      return c;
    }

    /* Find which element actually carries a row's band color (if any) */
    function paintTarget(row) {
      if (visibleBg(row)) return row;
      var kids = row.querySelectorAll("*");
      for (var i = 0; i < kids.length && i < 60; i++) {
        if (visibleBg(kids[i])) return kids[i];
      }
      return row; /* nothing painted: use the row itself as the canvas */
    }

    function build(events) {
      var table = document.querySelector(".hp-table");
      var aboutWidget = document.querySelector(".hp-table .widget-4.message");
      if (!table || !aboutWidget) return;
      var aboutRow = aboutWidget;
      while (aboutRow && aboutRow.parentNode !== table) aboutRow = aboutRow.parentNode;
      if (!aboutRow) return;

      /* ---- Build the section ---- */
      var section = document.createElement("div");
      section.className = "hp-row cc-events-row";
      var cards = "";
      for (var i = 0; i < events.length; i++) {
        var ev = events[i];
        var img = ev.flyer ? '<div class="cc-ev-img" style="background-image:url(&quot;' + esc(ev.flyer) + '&quot;)"></div>' : "";
        var btn = ev.signUp
          ? '<a class="cc-ev-btn" href="' + esc(ev.signUp) + '">Sign Up</a>'
          : '<a class="cc-ev-btn" href="/templates/events.htm">Details</a>';
        cards +=
          '<div class="cc-ev-card">' + img +
          '<div class="cc-ev-body">' +
          '<div class="cc-ev-title">' + esc(ev.title) + "</div>" +
          '<div class="cc-ev-date">' + esc(fmtDate(ev.start)) + "</div>" +
          btn +
          "</div></div>";
      }
      section.innerHTML =
        '<div class="cc-events-inner">' +
        '<div class="header-title cc-events-title">Upcoming Events</div>' +
        '<div class="cc-ev-grid">' + cards + "</div>" +
        '<div class="cc-ev-more"><a href="/templates/events.htm">View all upcoming events \u00bb</a></div>' +
        "</div>";
      table.insertBefore(section, aboutRow.nextSibling);

      /* ---- Keep the white/gray alternation intact ---- */
      try {
        var rows = [];
        for (var r = 0; r < table.children.length; r++) {
          if (/(^|\s)hp-row(\s|$)/.test(table.children[r].className)) rows.push(table.children[r]);
        }
        /* Sample the "gray" band color from an existing painted row */
        var grayC = null;
        for (var g = 0; g < rows.length; g++) {
          if (rows[g] === section) continue;
          var c = visibleBg(paintTarget(rows[g]));
          if (c && c !== "rgb(255, 255, 255)") { grayC = c; break; }
        }
        grayC = grayC || "#f4f4f4";
        var whiteC = "#ffffff";
        /* Keep the first row's current color as the anchor, then alternate */
        var first = visibleBg(paintTarget(rows[0]));
        var colors = (!first || first === "rgb(255, 255, 255)") ? [whiteC, grayC] : [first, whiteC];
        for (var q = 0; q < rows.length; q++) {
          var color = colors[q % 2];
          if (rows[q] === section) {
            /* our band paints via its full-bleed ::before */
            section.style.setProperty("--cc-band", color);
          } else {
            paintTarget(rows[q]).style.setProperty("background-color", color, "important");
          }
        }
      } catch (e) {}
    }

    fetch(JSON_URL + (isPreview ? "?t=" + Date.now() : ""))
      .then(function (r) { return r.json(); })
      .then(function (db) {
        var cutoff = Date.now() - 4 * 3600 * 1000; /* keep events up ~4h past start */
        var list = [];
        for (var k in db) {
          if (!db.hasOwnProperty(k)) continue;
          var ev = db[k];
          if (ev.removedFromFeed) continue;
          var t = new Date(ev.start).getTime();
          if (!isNaN(t) && t >= cutoff) list.push(ev);
        }
        list.sort(function (a, b) { return String(a.start).localeCompare(String(b.start)); });
        if (list.length) build(list.slice(0, 3));
      })
      .catch(function (e) { try { console.log("[chabad-custom] events section skipped:", e); } catch (e2) {} });
  })();
})();
