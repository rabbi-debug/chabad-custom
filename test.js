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

  /* --- Next Upcoming Event Box --- */
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
        
        var aboutRow = aboutWidget;
        while (aboutRow && aboutRow.parentNode !== table) {
           aboutRow = aboutRow.parentNode;
        }
        if (!aboutRow) return;

        var section = document.createElement("div");
        section.className = "hp-row cc-next-event-row";
        
        var img = nextEvent.flyer ? '<div class="cc-ev-img" style="background-image:url(&quot;' + esc(nextEvent.flyer) + '&quot;)"><img src="' + esc(nextEvent.flyer) + '" class="cc-mobile-flyer" /></div>' : "";
        var btnLabel = nextEvent.signUp ? "Sign Up" : "Learn More";
        var btnLink = nextEvent.signUp || "/templates/events.htm";
        var desc = snippet(nextEvent.description, 200);

        section.innerHTML = 
          '<div class="wrapper">' + 
             '<div class="header-title">Next Upcoming Event</div>' + 
             '<div class="cc-ev-box">' + 
                img +
                '<div class="cc-ev-content">' +
                   '<h3 class="cc-ev-title">' + esc(nextEvent.title) + '</h3>' +
                   '<div class="cc-ev-date">' + esc(fmtDate(nextEvent.start)) + '</div>' +
                   (desc ? '<div class="cc-ev-desc">' + esc(desc) + '</div>' : '') +
                   '<a class="cc-ev-btn" href="' + esc(btnLink) + '">' + btnLabel + '</a>' +
                '</div>' +
             '</div>' +
          '</div>';

        table.insertBefore(section, aboutRow.nextSibling);
      })
      .catch(function (e) { console.error("Event fetch error:", e); });
  })();

})();
