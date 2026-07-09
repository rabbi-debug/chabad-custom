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

  /* ---- Page registry: aid number -> page type ---- */
  var PAGE_TYPES = {
    "6409680": "form", /* Young Adults */
    "7133250": "form", /* Hospital Visitation Request */
    "6735906": "form", /* Friday Nights Summer Shabbat */
    "6072929": "info", /* About */
    "6528138": "info"  /* Kosher Explained */
  };

  /* ---- Identify the current page ---- */
  var m = location.pathname.match(/\/aid\/(\d+)\//);
  var aid = m ? m[1] : null;
  var type = (aid && PAGE_TYPES[aid]) || null;
  if (type) document.documentElement.className += " cc-type-" + type;

  /* Proof-of-life message (visible in the browser console) */
  try { console.log("[chabad-custom] live.js loaded", { aid: aid, type: type }); } catch (e) {}

  /* ---- Helpers for page-specific JS ---- */
  function onPage(id, fn) { if (aid === String(id)) fn(); }
  function onType(t, fn) { if (type === t) fn(); }

  /* ============================================
     Customizations go below this line
     ============================================ */

})();
