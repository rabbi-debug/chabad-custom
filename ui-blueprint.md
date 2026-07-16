# UI Blueprint — chabadwhiteplains.com

The design rulebook for custom styling on this site. Built from the actual Chabad One
platform stylesheets (`blue-theme.css`, `main.css`, `global.css`, `mobile/global.css`)
— not guessed. Any assistant making visual changes should read this first so new
elements blend in naturally.

**Keep this file updated:** when a new design decision is made, record it here in the
same commit.

---

## 1. Fonts

The platform loads two custom fonts. Always use these — never import anything new.

| Font | Weights available | Used for |
|---|---|---|
| **Muli** | 400, 600, 700, 800 | Everything: body, headings, nav, buttons, widgets |
| **Heebo** | 400, 500, 700, 800 | RTL (Hebrew) content only — ignore for English pages |

The global rule in the platform CSS sets `font-family: Muli, sans-serif` on every
element. So `font-family: inherit` in our custom CSS picks up Muli automatically.
Do not specify Muli explicitly — just use `inherit`.

---

## 2. Color palette

### CSS custom properties (from `blue-theme.css`)

| Variable | Hex | Role |
|---|---|---|
| `--theme-primary-color` | `#0F6CB8` | Primary blue — H1, buttons, Donate border, active underlines |
| `--theme-secondary-color` | `#2fd3c2` | Teal — hover states, H2/H3, links, active nav underline |
| `--theme-secondary-color-alt1` | `#07375E` | Deep navy — rarely used directly |
| `--theme-secondary-color-alt2` | `#00BDA9` | Darker teal — gradient start |
| `--theme-secondary-color-alt3` | `#54AFCB` | Sky blue — form submit button, calendar icons |
| `--theme-p-text` | `#343333` | Default body paragraph text |
| `--theme-gray` | `#333` | Dark gray — sidebar headings, labels |
| `--theme-grey-light` | `#666` | Mid gray — secondary text, bylines, dates |
| `--theme-grey-x-light` | `#ddd` | Light gray — borders, dividers |
| `--theme-grey-4` | `#E1E1E1` | Sidebar border color |
| `--theme-footer-text` | `#919191` | Footer body text |
| `--theme-footer-link` | `#A4A4A4` | Footer links and social icons |
| `--theme-white` | `#fff` | White — page/card backgrounds |

### Additional colors (from `main.css`)

| Hex | Role |
|---|---|
| `#0A3459` | Dark navy — index item titles, small-links, article headers |
| `#1E73BE` | Mid blue — co_index titles, "more" links |
| `#626262` | Mid gray — widget synopsis text, icon titles |
| `#ECECEC` | Alternate row background on homepage widget rows |
| `#fbfbfb` | No-hero-image content wrapper background |

### Footer & header backgrounds (confirmed from `global.css`)
- **Footer background:** `#0C4472` — confirmed exact value from `global.css`.
- **Mobile nav drawer background:** `rgba(10, 52, 89, 1)` = `#0A3459` dark navy.
- **Legacy topbar link color:** `#B8D2DF` (light blue-gray) — overridden by blue-theme on modern pages.

### Teal gradient (platform pattern — do not replicate in custom work)
```
linear-gradient(135deg, #00bda9 0%, #00b7b3 25%, #02b1bd 50%, #05a8c8 75%, #0c9dd4 100%)
```
Used on homepage banner and mailing list section. Keep our custom components flat.

### Rules of thumb
- **Blue (`#0F6CB8`)** = primary action: headings, buttons, Donate border.
- **Teal (`#2fd3c2`)** = hover/accent: button hovers, H2/H3 color, active nav underline.
- **`#54AFCB`** = platform form submit. Our blue buttons sit naturally beside it.
- **`#0C4472`** = confirmed footer background. Use as reference for footer text/icon colors.
- Never introduce a new color without adding it to this table.

---

## 3. Typography scale

| Element | Size | Weight | Color | Notes |
|---|---|---|---|---|
| Widget section headers (`.widget_header h5`, `.header-title`) | 36px | 800 | `#0F6CB8` | UPPERCASE, letter-spacing 1px |
| Page H1 / article title | 32px | 700 | `#0F6CB8` | — |
| Hero slide title (`big`) | 60px → 30px responsive | 800 | `#0F6CB8` | UPPERCASE |
| Site name in header | 26px → 15px responsive | 700 | white / `#0F6CB8` on scroll | UPPERCASE |
| Content H1 / `.Content_Title` | 26px | 700 | `#0F6CB8` | — |
| Content H2 | 22px | 700 | `#2fd3c2` | — |
| Content H3 | 17px | 700 | `#2fd3c2` | — |
| Nav menu items | 18px → 15px responsive | 400 | white / `#2fd3c2` on scroll | — |
| Body paragraph | 16px | 400 | `#343333` | — |
| Message widget synopsis | 18px | 400 | `#626262` | — |
| Footer org name | 18px | 100 (thin) | `#919191` | — |
| Breadcrumbs | 13px | 400 | `#0F6CB8` | — |

**Line heights:** widget headers 1.3em; body inherits platform default (~1.5).

---

## 4. Component patterns

### Buttons

| Style | Background | Text | Notes |
|---|---|---|---|
| Platform primary (`.co_global_button`) | `#2fd3c2` teal | white | UPPERCASE, 700, radius 2px |
| Platform "yellow" variant | `#0F6CB8` blue | white | Same markup, different class |
| Platform Donate (nav outline) | none | — | `2px solid #0F6CB8` border |
| Platform form submit | `#54AFCB` sky blue | white | UPPERCASE, radius 0, letter-spacing 1px |
| **Our custom buttons** | `#0F6CB8` blue | white | UPPERCASE, 700, radius 3px, hover → `#2fd3c2` |

### Cards / boxes
- White background, `1px solid #E1E1E1` border, `border-radius: 4px`.
- Soft shadow: `box-shadow: 0 4px 15px rgba(0,0,0,0.06)`.
- Padding: ~35px 40px desktop, ~25px mobile. Max width 960px, centered.

### Homepage section rows
`.hp-row` uses `padding: 100px 10px`. Alternating rows get `#ECECEC`. Our injected
rows should use the same 100px padding and white or `#f9f9f9` background.

### Social icons (footer)
Platform draws icons with a gradient SVG circle border. We keep the shape and only
override hover fill (→ `#2fd3c2`).

---

## 5. Layout & spacing

- **Content max-width:** 960px.
- **Body wrapper max-width:** 1235px with 65px horizontal padding on large screens.
- **Legacy fixed width:** 975px (from `global.css` — the old layout). `blue-theme.css`
  overrides this to 100% fluid. Our work is always fluid.
- **Mobile breakpoints:**
  - `max-width: 1024px` — nav collapses to hamburger.
  - `max-width: 768px` — content stacks. **Use this as our custom breakpoint.**
- **Homepage row padding:** 100px top/bottom.
- Mobile images: always `<img width="100%" height="auto">` — `background-image` gets
  cropped. See `.cc-mobile-flyer` pattern.

---

## 6. Mobile nav behavior (from `mobile/global.css`)

Useful when building anything near the header on mobile:

- Mobile header bar is **50px tall**, fixed at top. Never let custom content overlap it.
  Add `padding-top: 50px` to anything fixed/sticky.
- Nav drawer slides in from the **left**, covers **86% of screen width**.
- Drawer background: `#0A3459` dark navy. Menu items: white text.
- The hamburger `#MenuIcon` animates to an X when open.
- When open, the full page shifts right 86% (`#BodyContainer.open { left: 86% }`).

---

## 7. Page targeting rules

| Target | How to do it | Notes |
|---|---|---|
| Single page | `html.cc-aid-XXXXXX .selector` | Aid number from the page URL |
| All form pages | `body.form .selector` | Chabad One sets this natively |
| Homepage only | Target `.hp-table`, `.hp-row`, `.promo_slider` etc. | Only exist on homepage |
| All info pages | JS `onType("info", fn)` | Set via PAGE_TYPES registry in live.js |

⚠️ Never scope CSS using `cc-type-*` — JS adds them after load, causing a visible
flash. Use native classes for CSS; `cc-type-*` and `onType()` are fine for JS only.

---

## 8. Naming & code conventions

- **Every custom class starts with `cc-`** — prevents collision with Chabad One classes.
- Namespace by component: `cc-ev-*` for event box, `cc-foot-*` for footer overrides.
- Use `!important` only when overriding the platform's inline/injected styles. Always
  add a comment explaining why.
- Every CSS block gets a plain-language comment header — the owner reads these files.

---

## 9. What the site actually looks like (visual summary)

- **Header:** Transparent on homepage (overlays hero). White + `#ddd` bottom border
  when scrolled or on interior pages. Logo in a white circular badge (100px desktop,
  40px mobile). Site name: Muli UPPERCASE, white → `#0F6CB8` when scrolled.
- **Navigation:** White text on homepage, teal on scroll/interior. Active page: teal
  underline. "Donate" = outlined blue button. Collapses to hamburger at 1024px; drawer
  slides from left on mobile.
- **Page H1:** Large, bold, `#0F6CB8`. On interior pages: appears below header on a
  light gray (`#fbfbfb`) content background.
- **Body text:** `#343333`, Muli 400, ~16px.
- **Links:** Teal `#2fd3c2` for titles; blue `#0F6CB8` or `#1E73BE` for body links.
- **Footer:** `#0C4472` dark navy background, `#919191` text, `#A4A4A4` links. Social
  icons in gradient SVG circle borders, hover → teal.
- **Forms:** Labels `#333`, inputs `1px #ccc` border, submit button `#54AFCB` UPPERCASE.
  Section headings (e.g. "1. Your Information") are H2 in teal `#2fd3c2`.
- **Overall feel:** Clean, modern, community-focused. Blue = trustworthy; teal = warm.
  No decorative gradients in custom work — those are platform-only. Whitespace is
  generous on desktop.
