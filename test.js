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

  /* EXPERIMENT B: mailing-list band — match the footer's navy exactly.
     test.css already paints the band a default navy; this samples the
     footer's actual background color and applies it so the band and
     footer are always identical. */
  (function () {
    try {
      var parts = document.querySelectorAll(
        ".hp_subscribe .widget-4.subscribe," +
        ".hp_subscribe .widget-4.subscribe .wrapper," +
        ".hp_subscribe .widget-4.subscribe .widget_header," +
        ".hp_subscribe .widget-4.subscribe .widget_content"
      );
      if (!parts.length) return;
      var footer = document.getElementById("footer");
      if (!footer) return;
      var bg = window.getComputedStyle(footer).backgroundColor;
      if (!bg || bg === "transparent" || bg === "rgba(0, 0, 0, 0)") return;
      for (var i = 0; i < parts.length; i++) {
        parts[i].style.setProperty("background-image", "none", "important");
        parts[i].style.setProperty("background-color", bg, "important");
      }
    } catch (e) {}
  })();

})();
