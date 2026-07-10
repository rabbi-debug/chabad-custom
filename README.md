# chabad-custom

Custom CSS/JS for **chabadwhiteplains.com** (Chabad of White Plains), injected via Chabad One's header/footer code fields.

## Note for Claude (or any assistant) starting a new session

Read this file top to bottom — it is the complete system documentation. Then:
1. For styling work, consult the snapshots — all complete, each with a selector cheat sheet in its header comment: `snapshots/form-page.html`, `snapshots/info-page.html`, `snapshots/home-page.html`.
2. Make changes in `test.css`/`test.js` first; the owner previews them with the bookmarklet, then says "promote" → copy test into live.
3. Keep `test.*` mirroring `live.*` plus the current experiment (in preview mode, test files REPLACE live files).
4. The owner is new to GitHub/coding — explain in plain language and handle the technical steps.

## How it works

- A one-time **loader snippet** in Chabad One's header loads `live.css`; a snippet in the footer loads `live.js` — both served by GitHub Pages from this repo (`https://rabbi-debug.github.io/chabad-custom/`).
- All changes are made in this repo (usually by Claude). The site updates ~1 minute after a commit.
- `test.css` / `test.js` are the sandbox. They only load in a browser where **preview mode** is switched on (via the bookmarklet below). Visitors never see them.
- When a test change looks good, copy it into `live.css` / `live.js` ("promote").

## Files

| File | Purpose |
|---|---|
| `live.css` / `live.js` | What every visitor gets |
| `test.css` / `test.js` | Private sandbox, visible only in preview mode |
| `snapshots/form-page.html` | Form-page template (aid 6735906) with selector cheat sheet |
| `snapshots/info-page.html` | Info/article-page template (aid 6072929) with selector cheat sheet |
| `snapshots/home-page.html` | Homepage widget template with selector cheat sheet |

## Page targeting

Most Chabad One page URLs contain a unique ID: `/aid/6072929/` (the About page).

**Single page (CSS):** the header snippet tags the page instantly with a class like `cc-aid-6072929`:
```css
html.cc-aid-6072929 h1 { color: navy; }
```

**All form pages (CSS):** Chabad One itself puts a `form` class on the `<body>` of every form page, so this works instantly (no flash) and covers future forms automatically:
```css
body.form .form-submit-button { ... }
```

**Homepage (CSS):** the homepage URL has NO aid, so `cc-aid-*` does not exist there. However, homepage widget classes (`.hp-table`, `.hp-row`, `.promo_slider`, `.sneak-peek-item`, `.candlelighting`, etc.) appear ONLY on the homepage — so targeting them directly is automatically homepage-scoped:
```css
.hp-row .widget_header h5 { ... }   /* homepage-only by nature */
```

⚠️ Do NOT key CSS off `cc-type-*` classes — those are added by JS after page load, so CSS depending on them applies late (visible flash). Use `body.form` (native), `html.cc-aid-XXXX` (header snippet), or homepage-unique classes for CSS. The `cc-type-*` classes and `onType()` are fine for JS.

**JS targeting:** `live.js` identifies the page (`aid`), auto-detects form pages (body class) and the homepage (pathname), applies the `PAGE_TYPES` registry for manual categories (e.g. `info`), and provides `onPage(id, fn)` / `onType(type, fn)` helpers. Types: `form`, `home`, `info` (registry).

## Known site facts

- Platform: Chabad One (chabad.org sites). Template pages: `/templates/articlecco_cdo/aid/<AID>/jewish/<Slug>.htm`; homepage is `/`
- Form pages: body class `cco_body form secure sites-article`; forms use the Nova theme (`formCss2.css` + `nova.css`)
- Info pages: body class `cco_body sites-article` (no `form`); article text lives in `.co_body.article-body`
- Homepage: body class `cco_body` only; widget-based layout (`.hp-table`/`.hp-row`); internal id 5618929; slider uses jquery.cycle; photos widget is JS-populated
- Gotcha: on form pages an inline `<style id="GenFormStyles">` sets `.form-label` width `300px !important` — overriding label widths needs equal specificity + `!important`
- Useful aids: About 6072929 · Kosher Explained 6528138 (info) · Friday Nights Summer Shabbat 6735906 · Young Adults 6409680 · Hospital Visitation 7133250 (forms) · Donate 4970020

## Kill switch

First line of `live.js`: `var CC_ENABLED = true;` — set it to `false` and ALL customizations (CSS and JS) vanish site-wide within a minute of committing.

To undo a single bad change instead, revert the commit (ask Claude: "revert the last change").

## Loader snippets (installed in Chabad One — kept here for reference)

**Header** (header code injection):

```html
<script>
(function(){
  var base="https://rabbi-debug.github.io/chabad-custom/";
  var p=false; try{p=localStorage.getItem("cc-preview")==="on";}catch(e){}
  var l=document.createElement("link"); l.rel="stylesheet";
  l.href=base+(p?"test.css?t="+Date.now():"live.css");
  document.head.appendChild(l);
  var m=location.pathname.match(/\/aid\/(\d+)\//);
  document.documentElement.className+=" cc-on"+(m?" cc-aid-"+m[1]:"")+(p?" cc-preview":"");
})();
</script>
```

**Footer** (footer code injection):

```html
<script>
(function(){
  var base="https://rabbi-debug.github.io/chabad-custom/";
  var p=false; try{p=localStorage.getItem("cc-preview")==="on";}catch(e){}
  var s=document.createElement("script");
  s.src=base+(p?"test.js?t="+Date.now():"live.js");
  document.body.appendChild(s);
})();
</script>
```

## Preview bookmarklet

Save this as a bookmark; running it on the site toggles preview mode on/off (only in your browser). On mobile Chrome: type the bookmark's name in the address bar while on the site and tap it.

```
javascript:(function(){try{var k="cc-preview";var v=localStorage.getItem(k)==="on"?"off":"on";localStorage.setItem(k,v);alert("Preview mode: "+v);location.reload();}catch(e){alert(e);}})();
```

Preview mode loads the test files fresh on every reload (no caching), so test changes appear as soon as GitHub Pages publishes them (~1 min).

## Everyday workflow

1. Start a new Claude chat (GitHub connector on): "My repo rabbi-debug/chabad-custom customizes my Chabad One site — read the README, then: [describe change + page URL]"
2. Claude commits to `test.css`/`test.js`.
3. Open the page with preview mode ON → check it.
4. Say "promote" → Claude copies test into live.
5. Something wrong later? "Revert" or flip the kill switch.
