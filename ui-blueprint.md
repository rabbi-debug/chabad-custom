# UI Blueprint — chabadwhiteplains.com

The design rulebook for custom styling on this site. Built from the actual Chabad One
platform stylesheets (`blue-theme.css`, `main.css`) — not guessed. Any assistant making
visual changes should read this first so new elements blend in naturally.

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

These are the exact values declared as CSS custom properties in `blue-theme.css`:

| Variable | Hex | Role |
|---|---|---|
| `--theme-primary-color` | `#0F6CB8` | Primary blue — headings (h1), buttons, nav Donate border, active underlines |
| `--theme-secondary-color` | `#2fd3c2` | Teal — hover states, h2/h3, links, active nav, candlelighting times, mobile menu bg |
| `--theme-secondary-color-alt1` | `#07375E` | Deep navy — rarely used directly |
| `--theme-secondary-color-alt2` | `#00BDA9` | Slightly darker teal — gradient start |
| `--theme-secondary-color-alt3` | `#54AFCB` | Sky blue — form submit button, calendar icons |
| `--theme-p-text` | `#343333` | Default body paragraph text |
| `--theme-gray` | `#333` | Dark gray — sidebar headings, labels, general dark text |
| `--theme-grey-light` | `#666` | Mid gray — secondary text, bylines, dates |
| `--theme-grey-x-light` | `#ddd` | Light gray — borders, dividers, hover shadows |
| `--theme-grey-4` | `#E1E1E1` | Sidebar border color |
| `--theme-footer-text` | `#919191` | Footer body text |
| `--theme-footer-link` | `#A4A4A4` | Footer links and social icons |
| `--theme-white` | `#fff` | White — page/card backgrounds |

### Key colors from `main.css`

| Value | Role |
|---|---|
| `#0A3459` | Dark navy — used for index item titles, small-links, article headers in main.css |
| `#1E73BE` | Mid blue — used in main.css for co_index titles and more links |
| `#626262` | Mid gray — widget description text (message synopsis, icon titles) |
| `#ECECEC` | Alternate row background on homepage widget rows |
| `#fbfbfb` | No-hero content wrapper background |

### Footer background
The footer background is **dark navy** — visually approximately `#1a2a4a` (set by the
platform's global stylesheet, not overridable via a variable). Our custom CSS uses it
as the assumed footer background when choosing text and icon colors.

### Teal gradient (used in banners and subscribe section)
```
linear-gradient(135deg, #00bda9 0%, #00b7b3 25%, #02b1bd 50%, #05a8c8 75%, #0c9dd4 100%)
```
This appears on the homepage banner widget and mailing list section. Don't reproduce it
in custom components — it's a platform pattern, not ours to reuse.

### Rules of thumb
- **Blue (`#0F6CB8`)** = primary action color: headings, buttons, Donate border.
- **Teal (`#2fd3c2`)** = hover/accent: button hovers, h2/h3 text color, active nav underline.
- **`#54AFCB`** = the platform's form submit button color. When we style our own buttons
  blue (`#0F6CB8`) they stand out slightly but read as "same family."
- Never introduce a new color without adding it to this table.

---

## 3. Typography scale

Taken directly from `blue-theme.css` rules:

| Element | Size | Weight | Color | Transform |
|---|---|---|---|---|
| Widget section headers (`.widget_header h5`, `.header-title`) | 36px | 800 | `#0F6CB8` | UPPERCASE |
| Page H1 / article title | 32px | 700 | `#0F6CB8` | — |
| Hero slide title (`big`) | 60px → 30px responsive | 800 | `#0F6CB8` | UPPERCASE |
| Site name in header | 26px → 15px responsive | 700 | white / `#0F6CB8` on scroll | UPPERCASE |
| Content H1 / `.Content_Title` | 26px | 700 | `#0F6CB8` | — |
| Content H2 / `.Content_Large` | 22px | 700 | `#2fd3c2` | — |
| Content H3 | 17px | 700 | `#2fd3c2` | — |
| Nav menu items | 18px → 15px responsive | 400 | white / `#2fd3c2` on scroll | — |
| Body paragraph | 16px | 400 | `#343333` | — |
| Message widget synopsis | 18px | 400 | `#626262` | — |
| Footer org name | 18px | 100 (thin) | `#919191` | — |
| Breadcrumbs | 13px | 400 | `#0F6CB8` | — |

**Line heights:** widget headers 1.3em, body text inherits platform default (~1.5).  
**Letter spacing:** widget headers 1px, site name 0 (none specified).

---

## 4. Component patterns

### Buttons (platform style)
The platform has two button styles we should match or complement:

**Primary action button** (`.co_global_button .button`):
- Background `#2fd3c2` (teal), white text, UPPERCASE, weight 700, padding 10px 20px,
  `border-radius: 2px`. Hover: darker teal.

**"Yellow" variant** (`.co_global_button.yellow .button`):
- Background `#0F6CB8` (blue), white text. This is what the platform calls "yellow" —
  confusingly — but it looks blue.

**Donate / outline button** (nav):
- `border: 2px solid #0F6CB8`, no fill, weight 700, padding 6–8px 17px.

**Form submit button** (`.form-submit-button`):
- Background `#54AFCB`, white text, UPPERCASE, weight 700, padding 12px 30px,
  `border-radius: 0`, letter-spacing 1px.

**Our custom buttons** should use `#0F6CB8` (blue) background, white text, UPPERCASE,
weight 700, `border-radius: 3px`, hover → `#2fd3c2`. This sits naturally between the
platform's two main button styles.

### Cards / boxes
- White background, `1px solid #E1E1E1` border (matches `--theme-grey-4`), `border-radius: 4px`.
- Soft shadow: `box-shadow: 0 4px 15px rgba(0,0,0,0.06)`.
- Content padding: ~35px 40px desktop, ~25px mobile.
- Max width 960px (`sites-wrapper` uses this), centered with `margin: 0 auto`.

### Homepage section rows
The platform's `.hp-row` uses `padding: 100px 10px` and alternates backgrounds
(`hp-table > :nth-of-type(2n)` gets `#ECECEC`). Our injected rows should use the same
100px vertical padding and either white or `#f9f9f9` background to fit the alternating
pattern.

### Social icons (footer)
The platform draws social icons with a blue gradient circle border via an inline SVG
background. Our custom work keeps that pattern and only overrides color on hover
(hover → `#2fd3c2` fill).

---

## 5. Layout & spacing

- **Content max-width:** 960px (`sites-wrapper`, `message .wrapper`, `latest_photos .wrapper`).
- **Body wrapper max-width:** 1235px (`body_wrapper.co_body`) with 65px padding on large screens.
- **Mobile breakpoint:** `max-width: 1024px` for nav collapse; `max-width: 768px` for
  content stacking. Use **768px** as our custom breakpoint to match the content layer.
- **Homepage row padding:** 100px top/bottom (platform standard).
- Mobile behavior: flex columns stack vertically, text centers, buttons center.
- Images on mobile: use `<img width="100%" height="auto">` — never rely on
  `background-image` alone (gets cropped). See the `.cc-mobile-flyer` pattern.

---

## 6. Page targeting rules

| Target | How to do it | Notes |
|---|---|---|
| Single page | `html.cc-aid-XXXXXX .selector` | Aid number from the page URL |
| All form pages | `body.form .selector` | Chabad One sets this class natively |
| Homepage only | Target `.hp-table`, `.hp-row`, `.promo_slider` etc. | These classes only exist on the homepage |
| All info pages | Use JS `onType("info", fn)` | Set via PAGE_TYPES registry in live.js |

⚠️ Never scope CSS using `cc-type-*` classes — JS adds them after load, causing a
visible flash. Use the native classes above for CSS; `cc-type-*` and `onType()` are
fine for JS only.

---

## 7. Naming & code conventions

- **Every custom class starts with `cc-`** (e.g. `.cc-ev-box`, `.cc-foot-phone`).
  This prevents any collision with Chabad One's classes.
- Namespace by component: `cc-ev-*` for the event box, `cc-foot-*` for footer overrides.
- Use `!important` only when overriding the platform's inline/injected styles
  (e.g. the `#GenFormStyles` block that sets `.form-label` width). Always add a comment
  explaining why.
- Every CSS block gets a plain-language comment header — the owner reads these files.

---

## 8. What the site actually looks like (visual summary)

From screenshots and the real CSS:

- **Header:** transparent on homepage (overlays the hero image), white with border when
  scrolled or on interior pages. Logo in a white circular badge. Site name in Muli,
  UPPERCASE, white → blue when scrolled.
- **Navigation:** Muli, white text on homepage hero, teal when scrolled/interior.
  Active page gets a teal underline. "Donate" is an outlined button (blue border).
- **Page titles (H1):** Large, bold, `#0F6CB8`, Muli. On form/info pages these appear
  below the header with a light gray content background (`#fbfbfb`).
- **Body text:** `#343333`, Muli 400, ~16px.
- **Links in body:** teal `#2fd3c2` (headings/titles), blue `#0F6CB8` or `#1E73BE`
  depending on context.
- **Footer:** Dark navy background, `#919191` text, `#A4A4A4` links. Social icons in
  gradient-bordered circles, hover → teal.
- **Forms:** Labels in `#333`, inputs with 1px `#ccc` border. Submit button in
  `#54AFCB` (sky blue), UPPERCASE. Section headings (e.g. "1. Your Information")
  render as H2 in teal `#2fd3c2`.
- **Overall feel:** Clean, modern, community-focused. Blue is institutional/trustworthy;
  teal is warm/welcoming. No decorative gradients in custom work — those are platform
  patterns. White space is generous on desktop.
