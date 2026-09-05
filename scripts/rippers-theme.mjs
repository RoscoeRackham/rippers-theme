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
	return on;
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
	globalThis.Hooks.once('ready', () => applyRippersTheme());
}

export { MODULE_ID, MARKER, SETTING };
