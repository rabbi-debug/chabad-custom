# chabad-custom

Custom CSS/JS for **chabadwhiteplains.com**, injected via Chabad One's header/footer code fields.

## How it works

- A one-time **loader snippet** in Chabad One's header loads `live.css`; a snippet in the footer loads `live.js` — both served by GitHub Pages from this repo.
- All changes are made in this repo (usually by Claude). The site updates ~1 minute after a commit.
- `test.css` / `test.js` are the sandbox. They only load in a browser where **preview mode** is switched on (via the bookmarklet below). Visitors never see them.
- When a test change looks good, copy it into `live.css` / `live.js` ("promote").

## Files

| File | Purpose |
|---|---|
| `live.css` / `live.js` | What every visitor gets |
| `test.css` / `test.js` | Private sandbox, visible only in preview mode |
| `snapshots/` | Saved HTML source of representative pages, so Claude can write precise selectors |

## Page targeting

Every Chabad One page URL contains a unique ID: `/aid/6072929/` (the About page).

- The header snippet tags the page with a class like `cc-aid-6072929`, so CSS can target one page: `html.cc-aid-6072929 h1 { color: navy; }`
- `live.js` contains a **page registry** mapping IDs to types (`form`, `info`, ...) and adds a class like `cc-type-form`, plus `onPage()` / `onType()` helpers for JS.

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

Save this as a bookmark; clicking it on the site toggles preview mode on/off (only in your browser):

```
javascript:(function(){try{var k="cc-preview";var v=localStorage.getItem(k)==="on"?"off":"on";localStorage.setItem(k,v);alert("Preview mode: "+v);location.reload();}catch(e){alert(e);}})();
```

Preview mode loads the test files fresh on every reload (no caching), so test changes appear as soon as GitHub Pages publishes them (~1 min).

## Everyday workflow

1. Tell Claude what to change (give the page URL).
2. Claude commits to `test.css`/`test.js`.
3. Open the page with preview mode ON → check it.
4. Say "promote" → Claude copies test into live.
5. Something wrong later? "Revert" or flip the kill switch.
