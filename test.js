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

  /* EXPERIMENT: footer redesign (Option A layout)
     - Rewrites the single bold line into two lines: name + tappable phone.
     - Copies the exact font used by the site header title onto the
       footer name, so the two always match.
     Styling lives in test.css. */
  (function () {
    var el = document.querySelector("#footer .footer3");
    if (!el || el.querySelector(".cc-foot-place")) return;
    el.innerHTML =
      '<div class="cc-foot-place">Chabad of White Plains</div>' +
      '<div class="cc-foot-phone"><a href="tel:+19149986724">914 · 998 · 6724</a></div>';

    /* Match the header title's font exactly */
    var title = document.querySelector("#header a.site_title, #header .site_title, #header .branding-search a");
    var place = el.querySelector(".cc-foot-place");
    if (title && place) {
      try {
        var cs = window.getComputedStyle(title);
        if (cs.fontFamily) place.style.fontFamily = cs.fontFamily;
        if (cs.fontWeight) place.style.fontWeight = cs.fontWeight;
      } catch (e) {}
    }
  })();

})();
