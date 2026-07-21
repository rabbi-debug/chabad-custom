# UI Blueprint — chabadwhiteplains.com

The design rulebook for custom styling on this site. Built from the actual Chabad One
platform stylesheets (`purple-theme.css`, `main.css`, `global.css`, `mobile/global.css`)
— not guessed. Any assistant making visual changes should read this first so new
elements blend in naturally.

**Current theme (July 2026): orange + burgundy.** The active platform theme file is
`/css/sites6/purple-theme.css`. NOTE: despite the "purple" filename (a platform
leftover), the palette it defines is **orange `#f47721` + burgundy `#891738`**, not
purple. The site was previously blue + teal (`blue-theme.css`); the backend theme was
switched, so our custom components were re-colored to match. If the site colors ever
look wrong again, first check which theme file the page `<head>` loads and re-read its
`:root` variables — the backend can be changed there.

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

### CSS custom properties (from `purple-theme.css` — current theme)

| Variable | Hex | Role |
|---|---|---|
| `--theme-primary-color` | `#f47721` | Primary ORANGE — H1, article titles, section headers, Donate border, breadcrumbs, active underlines |
| `--theme-secondary-color` | `#891738` | BURGUNDY/maroon — buttons, H2/H3, links, nav hovers, mailing-list background |
| `--theme-secondary-color-alt1` | `#891738` | Burgundy (same as secondary) |
| `--theme-secondary-color-alt2` | `#67112A` | Darker burgundy — form submit button, calendar icon accents |
| `--theme-secondary-color-alt3` | `#67112A` | Darker burgundy |
| `--theme-p-text` | `#343333` | Default body paragraph text |
| `--theme-gray` | `#333` | Dark gray — sidebar headings, labels |
| `--theme-grey-light` | `#666` | Mid gray — secondary text, bylines, dates |
| `--theme-grey-x-light` | `#ddd` | Light gray — borders, dividers |
| `--theme-grey-4` | `#E1E1E1` | Sidebar border color |
| `--theme-header-nav-color` | `#ADCAE3` | Light blue-gray — top-bar link divider color |
| `--theme-footer-text` | `#919191` | Footer body text |
| `--theme-footer-link` | `#A4A4A4` | Footer links and social icons |
| `--theme-white` | `#fff` | White — page/card backgrounds |

### Additional colors (from `purple-theme.css`)

| Hex | Role |
|---|---|
| `#67112A` | Darkest burgundy — form submit button, calendar section-icon accents, button hover-darken |
| `#626262` | Mid gray — widget synopsis text, icon titles |
| `#ECECEC` | Alternate row background on homepage widget rows |
| `#fbfbfb` | No-hero-image content wrapper background |
| `#282828` | Near-black — submenu dropdown link text |

### Footer & header backgrounds (from `purple-theme.css`)
- **Footer background:** none set by the theme — the footer sits on the page white/transparent; footer accent color is orange `#f47721`, body text `#919191`, links `#A4A4A4`.
- **Mobile nav drawer background:** `#891738` burgundy (`.site-nav-wrapper`). Menu items: white text.
- **Header (interior/scrolled):** white with a `#ddd` bottom border; site name turns orange `#f47721`.

### Burgundy gradient (platform pattern — do not replicate in custom work)
The mailing-list section and icon fills use a flat burgundy "gradient" (all stops the
same `#891738`), i.e. effectively solid burgundy. Keep our custom components flat.

### Rules of thumb
- **Orange (`#f47721`)** = primary accent: section headers, H1/article titles, Donate border, breadcrumbs, our event date + header, our button border.
- **Burgundy (`#891738`)** = actions & secondary headings: platform buttons, H2/H3, links, nav hovers, our event title, our focus rings.
- **Darkest burgundy (`#67112A`)** = platform form submit button and button hover-darken.
- Our custom buttons use the OUTLINE style (orange border, transparent → orange fill on hover) to match the platform's own outline buttons.
- Never introduce a new color without adding it to this table.

---

## 3. Typography scale

| Element | Size | Weight | Color | Notes |
|---|---|---|---|---|
| Widget section headers (`.widget_header h5`, `.header-title`) | 36px | 800 | `#f47721` | UPPERCASE, letter-spacing 1px |
| Page H1 / article title | 32px | 700 | `#f47721` | — |
| Hero slide title (`big`) | 60px → 30px responsive | 800 | `#f47721` | UPPERCASE |
| Site name in header | 26px → 15px responsive | 700 | white / `#f47721` on scroll | UPPERCASE |
| Content H1 / `.Content_Title` | 26px | 700 | `#f47721` | — |
| Content H2 | 22px | 700 | `#891738` | — |
| Content H3 | 17px | 700 | `#891738` | — |
| Nav menu items | 18px → 15px responsive | 400 | white / `#891738` on scroll | — |
| Body paragraph | 16px | 400 | `#343333` | — |
| Message widget synopsis | 18px | 400 | `#626262` | — |
| Footer org name | 18px | 100 (thin) | `#919191` | — |
| Breadcrumbs | 13px | 400 | `#f47721` | — |

**Line heights:** widget headers 1.3em; body inherits platform default (~1.5).

---

## 4. Component patterns

### Buttons

| Style | Background | Text | Notes |
|---|---|---|---|
| Platform primary (`.co_global_button`) | `#891738` burgundy | white | UPPERCASE, 700, radius 2px, hover darkens to `#67112A` |
| Platform "yellow" variant | `#f47721` orange | white | Same markup, different class |
| Platform Donate (nav outline) | none | — | `2px solid #f47721` orange border |
| Platform form submit | `#67112A` dark burgundy | white | UPPERCASE, radius 0, letter-spacing 1px |
| Platform slider "Learn More" | none (outline) | white | `2px solid #f47721` border, fills orange on hover |
| **Our custom buttons** | none (OUTLINE) | `#f47721` orange | `2px solid #f47721`, UPPERCASE, 700, radius 3px; hover → orange fill + white text |

### Cards / boxes
- White background, `1px solid #E1E1E1` border, `border-radius: 4px`.
- Soft shadow: `box-shadow: 0 4px 15px rgba(0,0,0,0.06)`.
- Padding: ~35px 40px desktop, ~25px mobile. Max width 960px, centered.

### Homepage section rows
`.hp-row` uses `padding: 100px 10px`. Alternating rows get `#ECECEC`. Our injected
rows should use the same 100px padding and white or `#f9f9f9` background.

### Social icons (footer)
Platform draws icons with a gradient SVG circle border. We keep the shape and set the
icon color to orange `#f47721`, hover fill → white (platform default hover is burgundy
`#891738`).

---

## 5. Layout & spacing

- **Content max-width:** 960px.
- **Body wrapper max-width:** 1235px with 65px horizontal padding on large screens.
- **Legacy fixed width:** 975px (from `global.css` — the old layout). The active theme
  (`purple-theme.css`) overrides this to 100% fluid. Our work is always fluid.
- **Mobile breakpoints:**
  - `max-width: 1024px` — nav collapses to hamburger.
  - `max-width: 768px` — content stacks. **Use this as our custom breakpoint.**
- **Homepage row padding:** 100px top/bottom.
- Mobile images: always `<img width="100%" height="auto">` — `background-image` gets
  cropped. See `.cc-mobile-flyer` pattern.

---

## 6. Mobile nav behavior (current theme: `purple-theme.css`)

Useful when building anything near the header on mobile. NOTE: the current theme
overrides the older `mobile/global.css` drawer behavior — values below reflect what
actually renders now.

- Mobile header bar is **50px tall** (`.on-scroll`), fixed at top. Never let custom
  content overlap it. Add `padding-top: 50px` to anything fixed/sticky.
- Nav drawer (`.site-nav-wrapper`) slides in from the **RIGHT**, **300px wide**
  (`right: -300px` → `right: 0` when `.menu-open`).
- Drawer background: burgundy `#891738`. Menu items: white text.
- Hamburger (`.cs-mobile-menu-open`) is white on the homepage, burgundy `#891738` on
  scroll/interior; a close "X" (`.cs-mobile-menu-close`) sits top-right of the drawer.
- When open, a dark overlay (`rgba(0,0,0,.6)`) covers the page behind the drawer.

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
  40px mobile). Site name: Muli UPPERCASE, white → orange `#f47721` when scrolled.
- **Navigation:** White text on homepage, burgundy `#891738` on scroll/interior. Active
  page: burgundy underline. "Donate" = outlined orange button. Collapses to hamburger at
  1024px; drawer slides in from the RIGHT on mobile (burgundy `#891738` background).
- **Page H1:** Large, bold, orange `#f47721`. On interior pages: appears below header on
  a light gray (`#fbfbfb`) content background.
- **Body text:** `#343333`, Muli 400, ~16px.
- **Links:** Burgundy `#891738` for titles and most body links; orange `#f47721` for
  "more"/accent links.
- **Footer:** Sits on page white/transparent (no dark bar), `#919191` text, `#A4A4A4`
  links, orange `#f47721` accents. Social icons in gradient SVG circle borders, hover →
  burgundy (our override sets icon orange, hover white).
- **Forms:** Labels `#333`, inputs `1px #ccc` border, submit button dark burgundy
  `#67112A` UPPERCASE. Section headings (e.g. "1. Your Information") are H2 in burgundy
  `#891738`.
- **Overall feel:** Clean, modern, community-focused. Orange = warm/inviting; burgundy =
  grounded/traditional. No decorative gradients in custom work — those are platform-only.
  Whitespace is generous on desktop.
