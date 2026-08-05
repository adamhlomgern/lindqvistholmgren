# design-sync notes — Lindqvist Holmgren

## Repo shape

This is a Next.js **app**, not a published component-library package —
there is no `dist/` build and no `main`/`module`/`exports` in
`package.json`. The converter's package-shape adapter needs `node_modules/<cfg.pkg>`
(or `--entry`) to resolve to a real directory with a `package.json`, so a
**Windows NTFS junction** was created pointing the package name at the repo
root:

```
node_modules\lindqvistholmgren-ui  →  (junction to) repo root
```

`cfg.srcDir` = `components/ui` (relative to that root) scopes discovery to
just the six reusable UI primitives — `components/layout/*` and
`components/sections/*` are deliberately excluded (real business copy/data,
not generic reusable pieces).

**This junction is not committed** (it lives under the gitignored
`node_modules/`). On a fresh clone / re-sync, recreate it first:

```powershell
New-Item -ItemType Junction -Path "node_modules\lindqvistholmgren-ui" -Target "." -Force
```

## CSS / fonts source

The app has no standalone component stylesheet — all styling is Tailwind
utility classes compiled by `next build`. `cfg.cssEntry` points at a
**copied snapshot**: `.design-sync/.cache/app-build.css`, taken from
`next build`'s output (`.next/static/chunks/<hash>.css`). That output
filename is a **content hash that changes every build** — it is NOT
re-fetched automatically.

**Before any re-sync**, refresh the snapshot:

```bash
npm run build
# find the new hashed file:
find .next/static/chunks -iname "*.css"
cp <that file> .design-sync/.cache/app-build.css
```

Font files: the copied CSS's `@font-face` rules reference `../media/<hash>.woff2`
relative to their original `.next/static/chunks/` location. Copy the
matching files from `.next/static/media/` into `.design-sync/media/` (same
relative path the CSS expects) — see the grep-for-`url()` step in this
session's history if starting from scratch. This will need doing on every
re-sync too, since font hashes also change per build.

## Button: next/link → plain `<a>`

`components/ui/Button.tsx` originally used `next/link`'s `Link`. That broke
the whole bundle (`ReferenceError: process is not defined`, all 6 exports
missing from `window.LindqvistHolmgrenUI`) because Next's router code
assumes a Next.js runtime that isn't present in the standalone esbuild
bundle. Fixed (with the user's explicit sign-off) by switching `Button` to a
plain `<a href>` — same visual output, no client-side transitions. This is
a real, permanent change to the app's source, not a sync-only workaround.

## Re-sync risks

- The CSS/font snapshot in `.design-sync/.cache/` and `.design-sync/media/`
  is the biggest staleness risk — it silently diverges from the live app's
  Tailwind output whenever tokens/classes change and nobody re-runs the
  `npm run build` + copy steps above before syncing.
- `moss`, `lavender`, and `coral` color tokens are defined in
  `app/globals.css` but not yet used by any component — `conventions.md`
  notes them as reserved. If a component starts using them, the convention
  doc should be updated to move them into the "real" table.
- Scope is intentionally narrow (6 components in `components/ui/`). If
  `components/layout/*` or `components/sections/*` are ever wanted in the
  design system too, expect the same next/link-style portability issues in
  `Header.tsx` (nav `<Link>` usage) to resurface.
