# UI Blueprint — chabadwhiteplains.com

The design rulebook for all custom styling on this site. Any assistant making visual
changes should follow these conventions so every new element looks like it belongs
with the existing ones.

**Keep this file updated:** when a styling decision is made or changed (a new color,
a new component pattern, a changed convention), update this file in the same commit.

---

## 1. Color palette

| Role | Hex | Where it's used |
|---|---|---|
| **Primary blue** | `#0F6CB8` | Headings on custom components, primary buttons (event box title & button) |
| **Teal accent** | `#2fd3c2` | Button hover state, date/eyebrow text on the event box |
| **Gold** | `#c9b788` | Footer links (phone), footer social icons — the "footer accent" color |
| **White** | `#ffffff` | Footer headline text, hover state for gold elements |
| **Soft white** | `#e0e0e0` | Secondary footer text (address line) |
| **Body gray** | `#626262` | Paragraph/description text inside custom components |
| **Light background** | `#f9f9f9` | Full-width section backgrounds (event box row) |
| **Border gray** | `#e2e2e2` | 1px borders on cards/boxes |

Rules of thumb:
- Blue is the "action" color; teal is the "highlight/hover" color. Buttons go blue → teal on hover.
- Gold lives in the footer only (dark background). Don't use gold on white backgrounds — contrast is too low.
- Never introduce a new color without adding it to this table.

## 2. Typography

- Use the site's inherited font (`font-family: inherit`) — do not import new fonts.
- Component titles: ~24px, weight 700, line-height 1.3, primary blue.
- Eyebrow/date text: 13px, weight 700, UPPERCASE, letter-spacing ~0.5px, teal.
- Body text in components: 15px, line-height 1.6, body gray.
- Footer headline: 18px, weight 600, letter-spacing 0.08em, white.
- Footer secondary: 14px, letter-spacing 0.05em, soft white.

## 3. Component patterns

### Cards / boxes (pattern: event box)
- White background, `1px solid #e2e2e2` border, `border-radius: 4px`.
- Soft shadow: `box-shadow: 0 4px 15px rgba(0,0,0,0.06)`.
- Content padding: ~35px 40px on desktop, ~25px on mobile.
- Max width ~960px, centered with `margin: 0 auto`.

### Buttons
- Solid primary blue background, white text (`!important` may be needed to beat site styles).
- UPPERCASE, weight 700, letter-spacing 1px, `border-radius: 3px`.
- Padding ~10px 24px. Hover: background changes to teal, no underline.
- Transition: `background 0.3s ease`.

### Full-width homepage sections
- Wrap in `.hp-row`-style rows with a light background (`#f9f9f9`) and generous
  vertical padding to separate them from neighboring widgets.

### Links (footer style)
- Gold, no underline, slight letter-spacing, hover → white, with
  `transition: color 0.15s ease` where practical.

## 4. Layout & responsiveness

- **Breakpoint: `max-width: 768px`** — the single mobile breakpoint used everywhere.
- Mobile behavior: side-by-side layouts stack vertically (`flex-direction: column`),
  text becomes centered, buttons center themselves (`align-self: center`).
- Images: on desktop, decorative images may be CSS `background-image` (cover, left/center);
  on mobile prefer a real `<img>` at `width: 100%; height: auto` so nothing gets cropped
  (see the `.cc-mobile-flyer` pattern — flyers must be fully visible on phones).
- Whitespace philosophy: the site's stock template adds a lot of dead vertical space;
  our customizations remove it (zero-height `.clear` divs, `min-height: 0`). New
  components should not reintroduce large empty gaps.

## 5. Naming & code conventions

- **Every custom class starts with `cc-`** (e.g. `.cc-ev-box`, `.cc-foot-phone`,
  `.cc-next-event-row`). This makes our code instantly distinguishable from
  Chabad One's own classes and safe from collisions.
- Component classes are namespaced: `cc-ev-*` for the event box, `cc-foot-*` for footer.
- Page scoping in CSS: `html.cc-aid-XXXX` (single page), `body.form` (all forms),
  homepage-unique classes like `.hp-row` (homepage). Never scope CSS with `cc-type-*`
  (added late by JS → visible flash).
- Use `!important` only when needed to override the platform's inline/injected styles
  (e.g. `#GenFormStyles` on form pages), and note why in a comment.
- Every CSS block gets a plain-language comment header explaining what it does —
  the owner reads these files too.

## 6. Tone / feel

Clean, warm, and trustworthy: white cards, soft shadows, one strong blue, restrained
accents. Avoid loud gradients, heavy borders, or more than one accent color per
component. When in doubt, copy the event box's look.
