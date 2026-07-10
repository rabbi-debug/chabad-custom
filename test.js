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
  if (type) document.documentElement.className += " cc-type-" + type;

  try { console.log("[chabad-custom] test.js loaded (PREVIEW MODE)", { aid: aid, type: type }); } catch (e) {}

  function onPage(id, fn) { if (aid === String(id)) fn(); }
  function onType(t, fn) { if (type === t) fn(); }

  /* ============================================
     Experiments go below this line
     ============================================ */

  /* EXPERIMENT: footer redesign, Option A (classic serif)
     Rewrites the single bold line "White Plains, NY - 914-998-6724"
     into two lines: name + tappable phone number.
     The styling lives in test.css. */
  (function () {
    var el = document.querySelector("#footer .footer3");
    if (!el || el.querySelector(".cc-foot-place")) return; /* not found or already done */
    el.innerHTML =
      '<div class="cc-foot-place">Chabad of White Plains</div>' +
      '<div class="cc-foot-phone"><a href="tel:+19149986724">914 · 998 · 6724</a></div>';
  })();

})();
