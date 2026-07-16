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

  /* Auto-detect form pages */
  if (!type && /(!|^|\s)form(\s|$)/.test(document.body.className)) type = "form";

  /* Auto-detect the homepage */
  if (!type && (location.pathname === "/" || /^\/default\.asp/i.test(location.pathname))) type = "home";

  if (type) document.documentElement.className += " cc-type-" + type;

  try { console.log("[chabad-custom] live.js loaded", { aid: aid, type: type }); } catch (e) {}

  /* ---- Helpers ---- */
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

  /* ============================================================
     Shared event data fetcher — runs once, feeds both widgets
     ============================================================ */
  (function () {
    if (type !== "home") return;

    var JSON_URL = "https://rabbi-debug.github.io/chabad-custom/events.json";

    function esc(s) {
      return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    }

    function fmtDate(iso) {
      var d = new Date(iso);
      if (isNaN(d.getTime())) return "";
      try {
        var day = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(d);
        var time = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(d);
        return day + " \u2022 " + time;
      } catch (e) { return d.toLocaleString(); }
    }

    function snippet(desc, max) {
      var t = String(desc || "").replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      if (t.length > max) t = t.slice(0, max).replace(/\s+\S*$/, "") + "\u2026";
      return t;
    }

    fetch(JSON_URL + "?t=" + Date.now())
      .then(function (r) { return r.json(); })
      .then(function (db) {
        var now = Date.now();
        var list = [];
        for (var k in db) {
          if (!db.hasOwnProperty(k)) continue;
          var ev = db[k];
          if (ev.removedFromFeed) continue;
          var t = new Date(ev.start).getTime();
          if (!isNaN(t) && t >= now - (4 * 3600 * 1000)) list.push(ev);
        }
        if (list.length === 0) return;
        list.sort(function (a, b) { return new Date(a.start) - new Date(b.start); });
        var nextEvent = list[0];

        var table = document.querySelector(".hp-table");
        var aboutWidget = document.querySelector(".hp-table .widget-4.message");
        if (!table || !aboutWidget) return;

        /* Find the About row (direct child of .hp-table) */
        var aboutRow = aboutWidget;
        while (aboutRow && aboutRow.parentNode !== table) {
          aboutRow = aboutRow.parentNode;
        }
        if (!aboutRow) return;

        /* ── NEW V2: About-style event section ──────────────────────────
           Mirrors the About section's native .widget-4.message structure
           so it blends in as if it were a built-in homepage widget.
           Inserted immediately after the About row, before the old box.
        ────────────────────────────────────────────────────────────────── */
        var btnLabel = nextEvent.signUp ? "Sign Up" : "Learn More";
        var btnLink  = nextEvent.signUp || "/templates/events.htm";
        var desc     = snippet(nextEvent.description, 220);
        var dateStr  = fmtDate(nextEvent.start);

        var msgRow = document.createElement("div");
        msgRow.className = "hp-row cc-msg-ev-row";
        msgRow.innerHTML =
          '<div class="widget-4 message custom feed">' +
            '<div class="wrapper">' +
              '<div class="widget_header"><h5>Next Upcoming Event</h5></div>' +
              '<div class="widget_content message_format">' +
                '<div class="bottom_padding">' +
                  '<div class="cc-msg-ev-title">' + esc(nextEvent.title) + '</div>' +
                  '<div class="cc-msg-ev-date">' + esc(dateStr) + '</div>' +
                  (desc ? '<div class="cc-msg-ev-desc">' + esc(desc) + '</div>' : '') +
                '</div>' +
                '<a class="readMore cc-msg-ev-btn" href="' + esc(btnLink) + '">' + esc(btnLabel) + '</a>' +
              '</div>' +
            '</div>' +
          '</div>';

        /* Insert after About row */
        table.insertBefore(msgRow, aboutRow.nextSibling);

        /* ── OLD V1: Custom card-style event box (unchanged) ────────────
           Inserted after the new v2 row (i.e. after msgRow).
        ────────────────────────────────────────────────────────────────── */
        var img = nextEvent.flyer
          ? '<div class="cc-ev-img" style="background-image:url(&quot;' + esc(nextEvent.flyer) + '&quot;)"><img src="' + esc(nextEvent.flyer) + '" class="cc-mobile-flyer" /></div>'
          : "";

        var cardRow = document.createElement("div");
        cardRow.className = "hp-row cc-next-event-row";
        cardRow.innerHTML =
          '<div class="wrapper">' +
            '<div class="header-title">Next Upcoming Event</div>' +
            '<div class="cc-ev-box">' +
              img +
              '<div class="cc-ev-content">' +
                '<h3 class="cc-ev-title">' + esc(nextEvent.title) + '</h3>' +
                '<div class="cc-ev-date">' + esc(dateStr) + '</div>' +
                (desc ? '<div class="cc-ev-desc">' + esc(desc) + '</div>' : '') +
                '<a class="cc-ev-btn" href="' + esc(btnLink) + '">' + esc(btnLabel) + '</a>' +
              '</div>' +
            '</div>' +
          '</div>';

        /* Insert after the new v2 row */
        table.insertBefore(cardRow, msgRow.nextSibling);
      })
      .catch(function (e) { console.error("Event fetch error:", e); });
  })();

})();
