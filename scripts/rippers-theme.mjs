/* =============================================================================
 * rippers-theme.mjs — the "Rippers Unmasked" whole-app Foundry UI theme.
 * -----------------------------------------------------------------------------
 * Foundry v13/v14 has NO public API to register a named theme into the core
 * "Color Scheme" picker (CONST.CSS_THEMES is a frozen constant; ClientSettings
 * exposes no theme registration — verified against foundryvtt.com/api this
 * session). So this module ships the theme the supported way: a client-scoped
 * setting whose onChange toggles our OWN marker class on <html>, with the CSS in
 * module.json `styles` keyed on that marker. Result: fully OPT-IN and TOGGLEABLE
 * from Configure Settings ▸ Module Settings, never force-applied.
 *
 * The marker is our own (`rippers-theme`) — NOT core's `.theme-dark` / `.theme-light`
 * (which core puts on <body>) — so we never fight or hijack core's light/dark scheme.
 * LOOK ONLY: no DOM/behaviour changes, no mechanics. Harmless in headless tests.
 * ============================================================================= */

const MODULE_ID = 'rippers-theme';
const MARKER = 'rippers-theme';          // -> html.rippers-theme in the stylesheet
const SETTING = 'enabled';

/** Toggle the theme marker on the document root. */
export function applyRippersTheme(enabled) {
	const on = (enabled === undefined) ? getEnabled() : !!enabled;
	document.documentElement?.classList?.toggle(MARKER, on);
	syncPause(); // the Intermission curtain rides the theme toggle (only shows when theme is ON + paused)
	return on;
}

// ── the Intermission pause curtain (v0.2.0) ──────────────────────────────────
// Replaces Foundry's stock pause (spinner + "GAME PAUSED") with the designed
// lowered curtain + stopped pocket watch. Austin ruled: the text is 'Intermission'
// ONLY — no rotation set, and the "THE TABLE IS AT REST" divider is dropped. Quiet
// by design (it sits for minutes): period props, no spinner, no motion. Gated on the
// theme being ON, so non-theme users keep the stock pause untouched.
export const PAUSE_LINE = 'Intermission';
// The mock's atmospheric subline, dropped per Austin's "text 'Intermission' ONLY".
// Left here as a one-line restore if that reading is ever reversed (set to a string).
export const PAUSE_SUBLINE = null;

/** Pure: the pause overlay's inner HTML (headless-testable). Period props only, no motion. */
export function pauseMarkup() {
	const sub = PAUSE_SUBLINE ? `<p class="rt-pause-sub">${PAUSE_SUBLINE}</p>` : '';
	return `
		<div class="rt-pause-scrim"></div>
		<div class="rt-pause-valance"></div>
		<div class="rt-pause-drape l"></div><div class="rt-pause-drape r"></div>
		<div class="rt-pause-seam"></div><div class="rt-pause-rope"></div><div class="rt-pause-tassel"></div>
		<div class="rt-pause-plate">
			<div class="rt-pause-watch">
				<span class="bow"></span><span class="case"></span><span class="face"></span>
				<span class="wtick" style="transform:rotate(0deg)"></span><span class="wtick" style="transform:rotate(90deg)"></span>
				<span class="wtick" style="transform:rotate(180deg)"></span><span class="wtick" style="transform:rotate(270deg)"></span>
				<span class="hand h"></span><span class="hand m"></span><span class="pin"></span><span class="crack"></span>
			</div>
			<p class="rt-pause-line">${PAUSE_LINE}</p>${sub}
		</div>`;
}

let pauseEl = null;
function ensurePauseEl() {
	if (pauseEl?.isConnected) return pauseEl;
	pauseEl = document.createElement('div');
	pauseEl.id = 'rt-pause';
	pauseEl.setAttribute('aria-hidden', 'true');
	pauseEl.innerHTML = pauseMarkup();
	document.body?.appendChild(pauseEl);
	return pauseEl;
}

/** Show the curtain only when the theme is ON and the game is paused; hide otherwise. */
export function syncPause() {
	const themeOn = !!document.documentElement?.classList?.contains(MARKER);
	const paused = !!globalThis.game?.paused;
	if (themeOn && paused) ensurePauseEl().classList.add('on');
	else if (pauseEl) pauseEl.classList.remove('on');
}

function getEnabled() {
	try { return !!globalThis.game?.settings?.get(MODULE_ID, SETTING); }
	catch { return false; }
}

/** Register the client-scoped toggle. */
export function registerThemeSetting() {
	globalThis.game?.settings?.register(MODULE_ID, SETTING, {
		name: 'RIPPERS.THEME.EnableName',
		hint: 'RIPPERS.THEME.EnableHint',
		scope: 'client',          // per-device opt-in; flip to 'world' to push it table-wide
		config: true,             // a checkbox in Configure Settings ▸ Module Settings
		type: Boolean,
		default: false,
		requiresReload: false,
		onChange: (value) => applyRippersTheme(value),
	});
}

// Live wiring — only in Foundry (Hooks present). No-op under headless tests.
if (typeof globalThis.Hooks?.once === 'function') {
	globalThis.Hooks.once('init', () => { registerThemeSetting(); applyRippersTheme(); });
	// Re-apply once the world is ready so a saved-on value survives a reload with no flash-of-unstyled swap.
	globalThis.Hooks.once('ready', () => { applyRippersTheme(); syncPause(); });
	// core fires pauseGame whenever the pause state flips — swap the curtain in/out.
	globalThis.Hooks.on?.('pauseGame', () => syncPause());
}

export { MODULE_ID, MARKER, SETTING };
