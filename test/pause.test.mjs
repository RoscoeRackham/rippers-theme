// rippers-theme — headless coverage of the Intermission pause markup (pure).
import { test } from 'node:test';
import assert from 'node:assert/strict';

const th = await import('../scripts/rippers-theme.mjs');
const { pauseMarkup, PAUSE_LINE, PAUSE_SUBLINE, MARKER } = th;

test('PAUSE_LINE is Austin\'s ruled text — Intermission, natural case', () => {
	assert.equal(PAUSE_LINE, 'Intermission');
	assert.doesNotMatch(PAUSE_LINE, /^[A-Z\s]+$/); // Pirata law: never all-caps
});

test('pauseMarkup: the Intermission line, no rotation set, no divider (Austin ruled)', () => {
	const html = pauseMarkup();
	assert.match(html, /rt-pause-line">Intermission</);
	// the "THE TABLE IS AT REST" divider is dropped
	assert.doesNotMatch(html, /TABLE IS AT REST/i);
	// no rotation set — none of the alternate lines survive
	assert.doesNotMatch(html, /The curtain is down|The lantern is dimmed|Held between breaths|ROTATION SET/i);
	// period props present: curtain + stopped pocket watch
	assert.match(html, /rt-pause-valance/);
	assert.match(html, /rt-pause-drape/);
	assert.match(html, /rt-pause-watch/);
	assert.match(html, /class="hand h"/);
});

test('pauseMarkup: subline dropped by default (text Intermission ONLY), restorable via PAUSE_SUBLINE', () => {
	assert.equal(PAUSE_SUBLINE, null);
	assert.doesNotMatch(pauseMarkup(), /rt-pause-sub/);
});

test('MARKER is the theme class the CSS + pause gate are scoped under', () => {
	assert.equal(MARKER, 'rippers-theme');
});

// ── source-shape guards ──────────────────────────────────────────────────────
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const src = readFileSync(fileURLToPath(new URL('../scripts/rippers-theme.mjs', import.meta.url)), 'utf8');

test('GUARD: the curtain is gated on theme-on AND paused (never force-shown)', () => {
	assert.match(src, /classList\?\.contains\(MARKER\)/);
	assert.match(src, /game\?\.paused/);
});

test('GUARD: rides the pauseGame hook and the theme toggle', () => {
	assert.match(src, /Hooks\.on\?\.\('pauseGame'/);
	assert.match(src, /syncPause\(\); \/\/ the Intermission curtain rides the theme toggle/);
});
