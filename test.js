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

  try { console.log("[chabad-custom] test.js loaded", { aid: aid, type: type }); } catch (e) {}

  function onPage(id, fn) { if (aid === String(id)) fn(); }
  function onType(t, fn) { if (type === t) fn(); }

  /* ============================================
     Customizations go below this line
     ============================================ */

  /* --- Footer formatting --- */
  setTimeout(function () {
    var footerEl = document.querySelector('#footer .footer3') || document.querySelector('#footer .bottom_padding');
    if (!footerEl) return;
    var content = footerEl.innerHTML;
    var targetRegex = /Chabad of White Plains[\s\S]*?White Plains,\s*NY[\s\S]*?914-998-6724/i;
    if (targetRegex.test(content)) {
      footerEl.innerHTML = content.replace(targetRegex,
        '<div class="cc-foot-place">Chabad of White Plains</div>' +
        '<div class="cc-foot-phone">White Plains, NY &bull; <a href="tel:914-998-6724">914-998-6724</a></div>'
      );
    }
  }, 100);

  /* --- Upcoming Event section (homepage only) ---
     Inserts between About and Programs.
     - Uses the site's native .g960 + .wrapper pattern for width
     - Never sets any background color — the site's own CSS nth-child
       rules handle the white/gray band alternation automatically
     - Heading style cloned from the native Programs heading at runtime */
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
        var day = new Intl.DateTimeFormat("en-US", {
          timeZone: "America/New_York", weekday: "long", month: "long", day: "numeric"
        }).format(d);
        var time = new Intl.DateTimeFormat("en-US", {
          timeZone: "America/New_York", hour: "numeric", minute: "2-digit"
        }).format(d);
        return day + " \u00b7 " + time;
      } catch (e) { return d.toLocaleString(); }
    }

    function snippet(desc, max) {
      var t = String(desc || "")
        .replace(/<br\s*\/?>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ").trim();
      if (t.length > max) t = t.slice(0, max).replace(/\s+\S*$/, "") + "\u2026";
      return t;
    }

    fetch(JSON_URL + (isPreview ? "?t=" + Date.now() : ""))
      .then(function (r) { return r.json(); })
      .then(function (db) {
        var cutoff = Date.now() - 4 * 3600 * 1000;
        var list = [];
        for (var k in db) {
          if (!db.hasOwnProperty(k)) continue;
          var ev = db[k];
          if (ev.removedFromFeed) continue;
          var t = new Date(ev.start).getTime();
          if (!isNaN(t) && t >= cutoff) list.push(ev);
        }
        if (!list.length) return;
        list.sort(function (a, b) { return String(a.start).localeCompare(String(b.start)); });

        var table = document.querySelector(".hp-table");
        var aboutWidget = document.querySelector(".hp-table .widget-4.message");
        if (!table || !aboutWidget) return;
        var aboutRow = aboutWidget;
        while (aboutRow && aboutRow.parentNode !== table) aboutRow = aboutRow.parentNode;
        if (!aboutRow) return;

        /* Build the section using the site's own .g960 class for width */
        var ev = list[0];
        var img = ev.flyer
          ? '<div class="cc-ev-img" style="background-image:url(&quot;' + esc(ev.flyer) + '&quot;)"></div>'
          : "";
        var btn = ev.signUp
          ? '<a class="cc-ev-btn" href="' + esc(ev.signUp) + '">Sign Up</a>'
          : '<a class="cc-ev-btn" href="/templates/events.htm">Details</a>';
        var desc = snippet(ev.description, 200);

        var section = document.createElement("div");
        section.className = "hp-row cc-next-event-row";
        section.innerHTML =
          /* .g960 is the site's own centering class — same as Programs uses */
          '<div class="g960">' +
            '<div class="cc-ev-heading">Upcoming Events</div>' +
            '<div class="cc-ev-box">' +
              img +
              '<div class="cc-ev-content">' +
                '<div class="cc-ev-title">' + esc(ev.title) + '</div>' +
                '<div class="cc-ev-date">' + esc(fmtDate(ev.start)) + '</div>' +
                (desc ? '<div class="cc-ev-desc">' + esc(desc) + '</div>' : '') +
                btn +
              '</div>' +
            '</div>' +
            '<div class="cc-ev-more"><a href="/templates/events.htm">View all upcoming events &raquo;</a></div>' +
          '</div>';

        table.insertBefore(section, aboutRow.nextSibling);

        /* Clone heading style from the native Programs title */
        try {
          var ref = document.querySelector(".sneak-peek-container .header-title") ||
                    document.querySelector(".header-title");
          var heading = section.querySelector(".cc-ev-heading");
          if (ref && heading) {
            var cs = window.getComputedStyle(ref);
            ["fontFamily","fontSize","fontWeight","color",
             "letterSpacing","textTransform","lineHeight"].forEach(function (p) {
              heading.style[p] = cs[p];
            });
            heading.style.textAlign = "center";
            heading.style.marginBottom = "24px";
          }
        } catch (e) {}
      })
      .catch(function (e) {
        try { console.log("[chabad-custom] events section skipped:", e); } catch (e2) {}
      });
  })();

})();
