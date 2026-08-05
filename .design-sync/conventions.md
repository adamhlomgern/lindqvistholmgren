# Lindqvist Holmgren — design system conventions

A small, dark-mode-only marketing-site UI kit. There is no light theme and no
theme provider — the dark palette is the only mode.

## Wrapping and setup

**Every composition must sit on a dark background.** Only `Section` sets its
own page-level background (`bg-forest` / `bg-charcoal` / `bg-olive`). Every
other component — `Button` (secondary/ghost variants), `Card`, `Tag`,
`Eyebrow`, `Container` — is unstyled on background and assumes it is placed
inside a `Section` or another dark-toned wrapper. Placed directly on a light
canvas, their text and borders render illegibly (they use light-on-dark
colors like `text-bone` and `bg-bone/5`). Default composition: wrap any
group of these components in `<Section tone="forest">` (or `olive` /
`charcoal`).

`Button` renders a plain `<a href>` — no router dependency. Always pass
`href`.

## Styling idiom — Tailwind utility classes, real tokens

No CSS-in-JS, no theme object — plain Tailwind classes using this system's
own custom color/font tokens (defined in `styles.css`, not Tailwind
defaults):

| Token | Utility form | Use |
|---|---|---|
| `forest` | `bg-forest` / `text-forest` | Base page background (darkest-but-one) |
| `charcoal` | `bg-charcoal` | Darkest — header, footer, active nav chip |
| `olive` | `bg-olive` | Raised/alternate surface for section rhythm |
| `bone` | `text-bone` | Primary text (warm off-white) |
| `stone` | `text-stone` | Secondary/muted text |
| `emerald` | `bg-emerald` / `text-emerald` | Primary interactive accent — CTAs, active states, icons |
| `peach` | `bg-peach/20 text-peach` | Sparse playful accent (e.g. a person/avatar badge), used at low opacity as a tinted chip background |

`moss`, `lavender`, and `coral` are defined tokens (see `styles.css`) not
yet used anywhere in the shipped components — available, but unproven; treat
them as reserved rather than idiomatic until a real usage exists.

Fonts: `font-display` (Space Grotesk, bold/black weight, tight tracking —
headings only). Body text needs no explicit font class — the page default
(Geist) applies automatically. Small uppercase labels (eyebrows, nav, tags)
use `text-xs`/`text-sm` with `uppercase tracking-label` (a custom 0.08em
tracking token — wider than Tailwind's default `tracking-wide`).

Surfaces (`Card`, chip backgrounds) use a translucent light-on-dark tint —
`bg-bone/5` or `bg-bone/10` — rather than a distinct token color, so they
read as "raised" against any of the three dark section tones.

Radius is deliberately modest: `rounded-2xl` for cards/surfaces,
`rounded-full` for pills/chips/buttons/tags. Nothing sharper or more
rounded.

## Where the truth lives

Read `styles.css` (imports the token/font definitions and `_ds_bundle.css`)
before styling anything outside these six components. Each component's
`.prompt.md` documents its own props.

## Example composition

```tsx
<Section tone="olive">
  <Card>
    <Icon className="text-emerald" size={22} strokeWidth={2} />
    <h3 className="mt-4 font-display text-lg font-bold text-bone">Webb</h3>
    <p className="mt-2 text-sm leading-relaxed text-stone">
      Snabba, responsiva webbplatser byggda för att konvertera besökare till kunder.
    </p>
  </Card>
  <Button href="/kontakt" variant="secondary">
    Läs mer
  </Button>
</Section>
```
