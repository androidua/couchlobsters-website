#!/usr/bin/env node
// Validates site data files and HTML invariants. Exits non-zero on failure.
// Run locally or in CI: node .github/scripts/validate.js
// Both sync workflows run this before committing, so bad data can't reach main.

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const errors = [];

function fail(msg) { errors.push(msg); }
function read(file) { return fs.readFileSync(path.join(root, file), 'utf8'); }

// Evaluate a classic-script data file and pull out its top-level bindings.
function loadGlobals(file, names) {
  const src = read(file);
  const returns = names
    .map(n => `${n}: typeof ${n} === 'undefined' ? undefined : ${n}`)
    .join(', ');
  return new Function(`${src}\nreturn { ${returns} };`)();
}

const HTTPS = v => typeof v === 'string' && v.startsWith('https://');

// ── episodes-data.js ──────────────────────────────────────────────────────────
{
  const { EPISODES, UPCOMING_EPISODES } = loadGlobals('episodes-data.js', ['EPISODES', 'UPCOMING_EPISODES']);

  if (!Array.isArray(EPISODES) || EPISODES.length === 0) {
    fail('EPISODES is missing or empty');
  } else {
    let prevNum = Infinity;
    const seen = new Set();
    EPISODES.forEach((ep, i) => {
      const at = `EPISODES[${i}] (num ${ep.num})`;
      if (!Number.isInteger(ep.num)) fail(`${at}: num is not an integer`);
      if (seen.has(ep.num)) fail(`${at}: duplicate episode number`);
      seen.add(ep.num);
      if (ep.num >= prevNum) fail(`${at}: numbers must be strictly descending (newest first)`);
      prevNum = ep.num;
      if (!ep.title) fail(`${at}: empty title`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(ep.date) || isNaN(Date.parse(ep.date))) fail(`${at}: bad date "${ep.date}"`);
      if (!ep.duration) fail(`${at}: empty duration`);
      for (const k of ['artwork', 'spotifyUrl', 'appleUrl']) {
        if (!HTTPS(ep[k])) fail(`${at}: ${k} is not an https:// URL ("${ep[k]}")`);
      }
      if (!Array.isArray(ep.films) || ep.films.length === 0) fail(`${at}: films missing`);
    });
    console.log(`  ✓ EPISODES: ${EPISODES.length} entries valid`);
  }

  if (!Array.isArray(UPCOMING_EPISODES)) {
    fail('UPCOMING_EPISODES is missing or not an array (use [] to hide the teaser)');
  } else {
    UPCOMING_EPISODES.forEach((up, i) => {
      const at = `UPCOMING_EPISODES[${i}]`;
      if (!Array.isArray(up.films) || up.films.length !== 2) fail(`${at}: films must list exactly 2 titles`);
      if (up.artworks != null && (!Array.isArray(up.artworks) || !up.artworks.every(HTTPS))) {
        fail(`${at}: artworks must be null or an array of https:// URLs`);
      }
      if (!['recorded', 'scheduled'].includes(up.status)) fail(`${at}: status must be "recorded" or "scheduled"`);
    });
    console.log(`  ✓ UPCOMING_EPISODES: ${UPCOMING_EPISODES.length} entries valid`);
  }
}

// ── watching-data.js ──────────────────────────────────────────────────────────
{
  const { WATCHING } = loadGlobals('watching-data.js', ['WATCHING']);
  if (!Array.isArray(WATCHING)) {
    fail('WATCHING is missing or not an array');
  } else {
    const STATUSES = ['Watching', 'Watched', 'Want to Watch'];
    WATCHING.forEach((w, i) => {
      const at = `WATCHING[${i}] ("${w.title}")`;
      if (!w.title) fail(`WATCHING[${i}]: empty title`);
      if (!STATUSES.includes(w.status)) fail(`${at}: status "${w.status}" not one of ${STATUSES.join(' | ')}`);
      if (!/^\d{4}-\d{2}$/.test(w.date)) fail(`${at}: date "${w.date}" must be YYYY-MM`);
    });
    console.log(`  ✓ WATCHING: ${WATCHING.length} entries valid`);
  }
}

// ── HTML invariants ───────────────────────────────────────────────────────────
for (const page of ['index.html', 'episodes.html', 'watching.html', 'about.html']) {
  const html = read(page);
  // rel="noopener" with the quote right after only matches the bad (bare) form
  if (/rel="noopener"/.test(html)) fail(`${page}: external link missing rel="noopener noreferrer"`);
  if (/\bonerror\s*=/.test(html)) fail(`${page}: inline onerror handler (blocked by CSP script-src)`);
  if (/All \d+ episodes/.test(html)) fail(`${page}: hardcoded episode count in copy/meta (will drift)`);
  for (const tag of ['rel="canonical"', 'property="og:image"', 'name="twitter:card"']) {
    if (!html.includes(tag)) fail(`${page}: missing ${tag}`);
  }
}
console.log('  ✓ HTML invariants hold on all 4 pages');

// ── sitemap.xml ───────────────────────────────────────────────────────────────
{
  const xml = read('sitemap.xml');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  const mods = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map(m => m[1]);
  if (locs.length < 4) fail(`sitemap.xml: expected 4+ <loc> entries, found ${locs.length}`);
  mods.forEach(m => { if (!/^\d{4}-\d{2}-\d{2}$/.test(m)) fail(`sitemap.xml: bad <lastmod> "${m}"`); });
  console.log(`  ✓ sitemap.xml: ${locs.length} URLs, lastmod dates well-formed`);
}

if (errors.length) {
  console.error(`\n✗ Validation failed with ${errors.length} error(s):`);
  errors.forEach(e => console.error('  - ' + e));
  process.exit(1);
}
console.log('\n✓ All validations passed.');
