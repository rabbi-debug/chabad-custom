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

  /* --- EXPERIMENT (TEST ONLY): "Upcoming Events" homepage slider ---
     One event at a time, full section width, inserted between About
     and Programs. Reads events.json (the daily calendar archive).
     All colors/heading styles are SAMPLED FROM THE LIVE PAGE so the
     section stays native: the heading clones the Programs title's
     computed style, and the band colors are read from the existing
     sections. If the theme re-alternates section colors by itself
     after insertion, this code touches nothing. */
  (function () {
    if (type !== "home") return;

    var JSON_URL = "https://rabbi-debug.github.io/chabad-custom/events.json";
    var isPreview = /(^|\s)cc-preview(\s|$)/.test(document.documentElement.className);
    var WHITE = "rgb(255, 255, 255)";

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

    function snippet(desc, max) {
      var t = String(desc || "").replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      if (t.length > max) t = t.slice(0, max).replace(/\s+\S*$/, "") + "\u2026";
      return t;
    }

    function bgOf(el, pseudo) {
      try {
        var c = window.getComputedStyle(el, pseudo || null).backgroundColor;
        return (c && c !== "transparent" && c !== "rgba(0, 0, 0, 0)") ? c : null;
      } catch (e) { return null; }
    }
    /* A row's visible band color: the row itself, its ::before/::after,
       or a full-width child — whichever is actually painted */
    function bandColor(row) {
      var c = bgOf(row) || bgOf(row, "::before") || bgOf(row, "::after");
      if (c) return c;
      var kids = row.children;
      for (var i = 0; i < kids.length; i++) {
        c = bgOf(kids[i]) || bgOf(kids[i], "::before");
        if (c) return c;
      }
      return null;
    }

    function build(events) {
      var table = document.querySelector(".hp-table");
      var aboutWidget = document.querySelector(".hp-table .widget-4.message");
      if (!table || !aboutWidget) return;
      var aboutRow = aboutWidget;
      while (aboutRow && aboutRow.parentNode !== table) aboutRow = aboutRow.parentNode;
      if (!aboutRow) return;

      /* ---- Build the slider ---- */
      var section = document.createElement("div");
      section.className = "hp-row cc-events-row";
      var slides = "";
      for (var i = 0; i < events.length; i++) {
        var ev = events[i];
        var img = ev.flyer ? '<div class="cc-ev-img" style="background-image:url(&quot;' + esc(ev.flyer) + '&quot;)"></div>' : "";
        var btn = ev.signUp
          ? '<a class="cc-ev-btn" href="' + esc(ev.signUp) + '">Sign Up</a>'
          : '<a class="cc-ev-btn" href="/templates/events.htm">Details</a>';
        var desc = snippet(ev.description, 220);
        slides +=
          '<div class="cc-ev-slide">' + img +
          '<div class="cc-ev-body">' +
          '<div class="cc-ev-title">' + esc(ev.title) + "</div>" +
          '<div class="cc-ev-date">' + esc(fmtDate(ev.start)) + "</div>" +
          (desc ? '<div class="cc-ev-desc">' + esc(desc) + "</div>" : "") +
          btn +
          "</div></div>";
      }
      var multi = events.length > 1;
      section.innerHTML =
        '<div class="cc-events-inner">' +
        '<div class="cc-events-title">Upcoming Events</div>' +
        '<div class="cc-ev-slider">' +
        '<div class="cc-ev-track">' + slides + "</div>" +
        (multi ? '<button class="cc-ev-arrow cc-ev-prev" aria-label="Previous event">\u2039</button>' +
                 '<button class="cc-ev-arrow cc-ev-next" aria-label="Next event">\u203a</button>' : "") +
        "</div>" +
        (multi ? '<div class="cc-ev-dots"></div>' : "") +
        '<div class="cc-ev-more"><a href="/templates/events.htm">View all upcoming events \u00bb</a></div>' +
        "</div>";
      table.insertBefore(section, aboutRow.nextSibling);

      /* ---- Heading: clone the computed style of the native Programs title ---- */
      try {
        var ref = document.querySelector(".sneak-peek-container .header-title") || document.querySelector(".header-title");
        var titleEl = section.querySelector(".cc-events-title");
        if (ref && titleEl) {
          var cs = window.getComputedStyle(ref);
          ["fontFamily", "fontSize", "fontWeight", "color", "letterSpacing", "textTransform", "lineHeight"].forEach(function (p) {
            titleEl.style[p] = cs[p];
          });
          titleEl.style.textAlign = "center";
        }
      } catch (e) {}

      /* ---- Band colors: keep everything native ---- */
      try {
        var rows = [];
        for (var r = 0; r < table.children.length; r++) {
          if (/(^|\s)hp-row(\s|$)/.test(table.children[r].className)) rows.push(table.children[r]);
        }
        var myIdx = rows.indexOf(section);

        /* Sample the two native colors from the OTHER rows */
        var c0 = bandColor(rows[0]) || WHITE; /* anchor: first row keeps its color */
        var alt = null;
        for (var s = 1; s < rows.length; s++) {
          if (rows[s] === section) continue;
          var sc = bandColor(rows[s]) || WHITE;
          if (sc !== c0) { alt = sc; break; }
        }
        if (!alt) alt = (c0 === WHITE) ? "rgb(244, 244, 244)" : WHITE;

        /* Did the theme already re-alternate by itself (nth-child based)?
           Check whether every non-section row already matches the pattern. */
        var pattern = [c0, alt];
        var nativeHandled = true;
        for (var q = 0; q < rows.length; q++) {
          if (rows[q] === section) continue;
          if ((bandColor(rows[q]) || WHITE) !== pattern[q % 2]) { nativeHandled = false; break; }
        }

        /* My band always takes its slot's color (exact native value) */
        section.style.setProperty("--cc-band", pattern[myIdx % 2]);

        if (!nativeHandled) {
          /* Shift the rows below to keep the alternation, using ONLY the
             two sampled native colors. Overrides cover the row and its
             ::before/::after, whichever the theme actually paints. */
          var st = document.createElement("style");
          st.textContent =
            ".cc-band-0, .cc-band-0::before, .cc-band-0::after { background-color: " + pattern[0] + " !important; }" +
            ".cc-band-1, .cc-band-1::before, .cc-band-1::after { background-color: " + pattern[1] + " !important; }";
          document.head.appendChild(st);
          for (var w = myIdx + 1; w < rows.length; w++) {
            rows[w].className += " cc-band-" + (w % 2);
          }
        }
      } catch (e) {}

      /* ---- Slider behavior ---- */
      if (multi) {
        var track = section.querySelector(".cc-ev-track");
        var dotsEl = section.querySelector(".cc-ev-dots");
        var idx = 0, total = events.length, timer = null;
        var dots = [];
        for (var d = 0; d < total; d++) {
          var dot = document.createElement("span");
          dot.className = "cc-ev-dot" + (d === 0 ? " cc-on" : "");
          (function (n) { dot.onclick = function () { go(n); restart(); }; })(d);
          dotsEl.appendChild(dot);
          dots.push(dot);
        }
        function go(n) {
          idx = (n + total) % total;
          track.style.transform = "translateX(-" + (idx * 100) + "%)";
          for (var j = 0; j < dots.length; j++) dots[j].className = "cc-ev-dot" + (j === idx ? " cc-on" : "");
        }
        function restart() {
          if (timer) clearInterval(timer);
          timer = setInterval(function () { go(idx + 1); }, 6000);
        }
        section.querySelector(".cc-ev-prev").onclick = function () { go(idx - 1); restart(); };
        section.querySelector(".cc-ev-next").onclick = function () { go(idx + 1); restart(); };
        section.onmouseenter = function () { if (timer) clearInterval(timer); timer = null; };
        section.onmouseleave = restart;
        restart();
      }
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
        if (list.length) build(list.slice(0, 5));
      })
      .catch(function (e) { try { console.log("[chabad-custom] events section skipped:", e); } catch (e2) {} });
  })();
})();
