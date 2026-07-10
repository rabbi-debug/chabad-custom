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

  /* EXPERIMENT A: footer redesign
     Two lines (name + tappable phone), font copied from the header. */
  (function () {
    var el = document.querySelector("#footer .footer3");
    if (!el || el.querySelector(".cc-foot-place")) return;
    el.innerHTML =
      '<div class="cc-foot-place">Chabad of White Plains</div>' +
      '<div class="cc-foot-phone"><a href="tel:+19149986724">914 \u00b7 998 \u00b7 6724</a></div>';

    var title = document.querySelector("#header a.site_title, #header .site_title, #header .branding-search a");
    var place = el.querySelector(".cc-foot-place");
    if (title && place) {
      try {
        var cs = window.getComputedStyle(title);
        if (cs.fontFamily) place.style.fontFamily = cs.fontFamily;
      } catch (e) {}
    }
  })();

  /* EXPERIMENT B: mailing-list band cleanup
     Finds the "mailing list" section (heading + form inputs), tags it
     with cc- classes for test.css, replaces the teal gradient with the
     footer's exact navy, and normalizes the input fields. */
  (function () {
    try {
      /* 1. Find the smallest container holding both an input and the
            words "mailing list" — that's the band. */
      var inputs = document.querySelectorAll('input[type="email"], input[type="text"]');
      var band = null;
      for (var i = 0; i < inputs.length && !band; i++) {
        var p = inputs[i].parentNode, depth = 0;
        while (p && p !== document.body && depth < 10) {
          if (/mailing\s*list/i.test(p.textContent || "")) { band = p; break; }
          p = p.parentNode; depth++;
        }
      }
      if (!band || /(^|\s)cc-mailing-band(\s|$)/.test(band.className)) return;
      band.className += " cc-mailing-band";

      /* 2. Sample the footer's navy and use it as a flat background;
            strip any gradient found on the band or its children. */
      var footer = document.getElementById("footer");
      var navy = "#14315a"; /* fallback */
      if (footer) {
        var fbg = window.getComputedStyle(footer).backgroundColor;
        if (fbg && fbg !== "rgba(0, 0, 0, 0)" && fbg !== "transparent") navy = fbg;
      }
      var nodes = [band].concat([].slice.call(band.querySelectorAll("*")));
      for (var j = 0; j < nodes.length && j < 200; j++) {
        var st = window.getComputedStyle(nodes[j]);
        if (/gradient/i.test(st.backgroundImage || "")) {
          nodes[j].style.setProperty("background-image", "none", "important");
          nodes[j].style.setProperty("background-color", navy, "important");
        }
      }
      band.style.setProperty("background-color", navy, "important");

      /* 3. Tag the inputs and the heading so test.css can style them. */
      var fields = band.querySelectorAll('input[type="email"], input[type="text"]');
      for (var k = 0; k < fields.length; k++) {
        if (!/(^|\s)cc-mail-input(\s|$)/.test(fields[k].className)) fields[k].className += " cc-mail-input";
      }
      var heads = band.querySelectorAll("h1,h2,h3,h4,h5,div,span,p");
      for (var h = 0; h < heads.length; h++) {
        var t = (heads[h].textContent || "").replace(/\s+/g, " ").trim();
        if (/^join our mailing list$/i.test(t)) { heads[h].className += " cc-mail-heading"; break; }
      }
    } catch (e) {
      try { console.log("[chabad-custom] mailing band tweak skipped:", e); } catch (e2) {}
    }
  })();

})();
