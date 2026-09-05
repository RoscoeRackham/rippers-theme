# Rippers Unmasked — UI Theme

An **opt-in, toggleable** whole-app Foundry VTT theme (v13–v14) in the 2a **"Slash"**
register — near-black ground, blood-red accents, bone text — so the whole interface
matches the character sheet (`rippers-guise`) and the Stylish Action HUD theme
(`rippers-stylish-hud`). **Look only:** no mechanics, no DOM/behaviour changes.

> **STATUS: scaffold-and-hold.** The technical scaffold is in place — the module,
> the toggle, the token/font layer, the core `--color-*`/`--font-*` variable backbone,
> the generic window frame, and a legible token-level base for the core surfaces. The
> detailed per-surface **visual treatment** (accent placement, chat-card composition,
> frame styling weight, slash/notch motifs) is **held** until Design's mockup lands,
> then built onto this base — not designed twice.

## Turning it on

Configure Settings ▸ **Module Settings** ▸ *Rippers Unmasked theme* (a checkbox).
It is **client-scoped** — each person opts in on their own device; it is never
force-applied. Off by default.

> There is **no public theme-registration API** in Foundry v13/v14 — `CONST.CSS_THEMES`
> is frozen and `ClientSettings` exposes no theme hook (verified against foundryvtt.com/api).
> So the theme cannot appear in Foundry's core **Color Scheme** dropdown; it ships the
> supported way instead — a module setting whose toggle adds the class `rippers-theme`
> to `<html>`, with all CSS scoped under `html.rippers-theme`. To push it table-wide,
> change the setting's `scope` from `client` to `world` in `scripts/rippers-theme.mjs`.

## What it restyles

Application/window frames + headers, dialogs, the sidebar and its tabs + directory
items, the chat log + message cards + dice rolls, scene controls, scene navigation,
the players list, the hotbar/macro bar, tooltips, context menus, and form controls
(buttons/inputs/selects/textareas) globally.

The backbone is an override of Foundry's own `--color-*` / `--font-*` CSS variables
(so areas not hand-targeted still pick up the register), plus the generic window frame.
Type: Grenze Gotisch (titles/names), Pirata One (chrome voice — window titles, nav,
tabs), IBM Plex Mono (controls/labels/numbers/body), Spectral (prose). **Violet is
deliberately absent** — it is reserved for Miasma / guise tags per the canon register.

## Built for any number of modules

The user may run arbitrary third-party modules. This theme therefore works through
Foundry **core selectors + CSS custom properties**, never a specific module's ids —
so anything that respects the core classes/variables picks up the register for free.
The **generic window frame** (`.application`/`.window-app`) is the highest-leverage
surface: every dialog, sheet, and module window is themed without knowing the module.
It assumes no fixed set of sidebar tabs or count of apps/windows.

**Graceful degradation:** rules set only colour / background / border / font — never
width, position, display, or `clip-path` on generic frames — so an unknown module's
custom UI that ignores core classes stays **functional and legible** even when not
fully themed. It under-reaches rather than breaks; the toggle is the fall-back if a
module clashes.

## Known upkeep risk (Austin is aware)

- **v13's ApplicationV2 overhaul restructured the sidebar, scene navigation, players
  list and hotbar**, and these areas churn across v13→v14. The per-element selectors
  here follow Foundry's known chrome structure but were **not verified against a live
  v13 DOM** (no Foundry on the build machine). The variable overrides carry the bulk
  even where a specific selector misses, but **a live-install eyeball + selector fix-up
  pass is owed** — that is where a wrong id/class would show.
- Core uses **CSS Cascade Layers**; this sheet ships in the `module` layer (after core's
  `applications`/`system` layers) so it wins over core chrome without `!important`. A
  future core `exceptions`-layer rule could still beat a given selector.
- Interface Scale / Font Size / Interface Fading are core settings — the theme is built
  to survive when a user changes them; confirm on install.
- **Fonts** load via a Google-Fonts `@import` (the same interim approach as the sheet and
  HUD theme); local bundling is a deferred asset pass. Requires the client to be online.
  ⚠ The design brief asks for **bundled** faces (no external fetch) — bundling woff2 +
  `@font-face` is an owed step, best done in the build-to-mockup pass.
- **No core theme-picker entry.** Foundry v13/v14 exposes no API to register a named
  theme into the core Color Scheme dropdown (`CONST.CSS_THEMES` is frozen). This ships
  as a toggleable module setting instead — same opt-in behaviour, different location.

## Files

- `module.json` — manifest (`styles` + `esmodules`; `compatibility` 13→14).
- `scripts/rippers-theme.mjs` — the client-scoped setting + the `<html>` marker toggle.
- `styles/rippers-theme.css` — the theme, entirely scoped under `html.rippers-theme`.
- `languages/en.json` — the setting's name/hint.
