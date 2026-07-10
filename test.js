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
     /* --- 1) Footer Text Formatting Experiment --- */
  // Find the container holding the footer text
  var footerEl = document.querySelector('#footer .footer3') || document.querySelector('#footer .bottom_padding');
  
  if (footerEl) {
    var content = footerEl.innerHTML;
    // Look for the specific string (handles potential extra spaces just in case)
    var targetString = /Chabad of White Plains\s*White Plains, NY\s*-\s*914-998-6724/i;
    
    // Replace it with our new two-line HTML structure
    if (targetString.test(content)) {
      var newFooterText = '<div class="cc-foot-place">Chabad of White Plains</div>' +
                          '<div class="cc-foot-phone">White Plains, NY &bull; <a href="tel:914-998-6724">914-998-6724</a></div>';
      footerEl.innerHTML = content.replace(targetString, newFooterText);
    }
  }
     ============================================ */

})();
