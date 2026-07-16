/* ============================================================
   chabadwhiteplains.com — LIVE scripts (all visitors see this)
   Loaded on every page by the footer snippet.
   ============================================================ */

var CC_ENABLED = true; /* KILL SWITCH: set to false to disable ALL customizations site-wide */

(function () {
  if (!CC_ENABLED) {
    var links = document.querySelectorAll('link[href*="rabbi-debug.github.io/chabad-custom"]');
    for (var i = 0; i < links.length; i++) links[i].parentNode.removeChild(links[i]);
    return;
  }

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

  try { console.log("[chabad-custom] live.js loaded", { aid: aid, type: type }); } catch (e) {}

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
     Event widgets — shared fetch, feeds both V2 and V1
     ============================================================ */
  (function () {
    if (type !== "home") return;

    var JSON_URL = "https://rabbi-debug.github.io/chabad-custom/events.json";

    function esc(s) {
      return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    }

    function fmtDateShort(iso) {
      var d = new Date(iso);
      if (isNaN(d.getTime())) return "";
      try {
        var dayName  = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(d).toUpperCase();
        var monthDay = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" }).format(d).toUpperCase();
        var time     = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(d);
        return dayName + ", " + monthDay + " \u00b7 " + time;
      } catch (e) { return d.toLocaleString(); }
    }

    function fmtDateLong(iso) {
      var d = new Date(iso);
      if (isNaN(d.getTime())) return "";
      try {
        var day  = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(d);
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
        var ev = list[0];

        var table = document.querySelector(".hp-table");
        var aboutWidget = document.querySelector(".hp-table .widget-4.message");
        if (!table || !aboutWidget) return;

        var aboutRow = aboutWidget;
        while (aboutRow && aboutRow.parentNode !== table) aboutRow = aboutRow.parentNode;
        if (!aboutRow) return;

        var btnLabel = ev.signUp ? "Sign Up" : "Learn More";
        var btnLink  = ev.signUp || "/templates/events.htm";
        var desc     = snippet(ev.description, 120);

        /* —— NEW V2: image wrapped in link, button is dark navy —— */
        var flyerHtml = ev.flyer
          ? '<div class="cc-msg-ev-flyer">' +
              '<a href="' + esc(btnLink) + '" class="cc-msg-ev-flyer-link">' +
                '<img src="' + esc(ev.flyer) + '" class="cc-msg-ev-flyer-img" alt="' + esc(ev.title) + '">' +
              '</a>' +
            '</div>'
          : '';

        var v2 = document.createElement("div");
        v2.className = "hp-row cc-msg-ev-row";
        v2.innerHTML =
          '<div class="cc-msg-ev-card">' +
            flyerHtml +
            '<div class="cc-msg-ev-body">' +
              '<div class="cc-msg-ev-title">' + esc(ev.title) + '</div>' +
              '<div class="cc-msg-ev-date">' + esc(fmtDateShort(ev.start)) + '</div>' +
              (desc ? '<div class="cc-msg-ev-desc">' + esc(desc) + '</div>' : '') +
              '<a class="cc-msg-ev-link" href="' + esc(btnLink) + '">' + esc(btnLabel) + '</a>' +
            '</div>' +
          '</div>';

        table.insertBefore(v2, aboutRow.nextSibling);

        /* —— OLD V1: unchanged —— */
        var v1img = ev.flyer
          ? '<div class="cc-ev-img" style="background-image:url(&quot;' + esc(ev.flyer) + '&quot;)"><img src="' + esc(ev.flyer) + '" class="cc-mobile-flyer" /></div>'
          : '';

        var v1 = document.createElement("div");
        v1.className = "hp-row cc-next-event-row";
        v1.innerHTML =
          '<div class="wrapper">' +
            '<div class="header-title">Next Upcoming Event</div>' +
            '<div class="cc-ev-box">' +
              v1img +
              '<div class="cc-ev-content">' +
                '<h3 class="cc-ev-title">' + esc(ev.title) + '</h3>' +
                '<div class="cc-ev-date">' + esc(fmtDateLong(ev.start)) + '</div>' +
                (desc ? '<div class="cc-ev-desc">' + esc(desc) + '</div>' : '') +
                '<a class="cc-ev-btn" href="' + esc(btnLink) + '">' + esc(btnLabel) + '</a>' +
              '</div>' +
            '</div>' +
          '</div>';

        table.insertBefore(v1, v2.nextSibling);
      })
      .catch(function (e) { console.error("Event fetch error:", e); });
  })();

})();
