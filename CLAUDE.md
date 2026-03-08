# Couch Lobsters Website — Project Context for Claude Code

This file tells Claude Code everything it needs to know about this project.
Place this file in the root of the `couchlobsters-website` repo.

---

## What This Project Is

A static podcast website for **Couch Lobsters** — a film & TV series podcast hosted by
Jess & Dima. Built as plain HTML/CSS/JS (no frameworks, no build step required).

**Live domain:** couchlobsters.com  
**GitHub repo:** https://github.com/androidua/couchlobsters-website  
**Hosting:** Cloudflare Pages (auto-deploys when changes are pushed to `main` branch)  
**Workflow:** Edit files locally → `git push` → Cloudflare auto-deploys within ~2 minutes

---

## File Structure

```
couchlobsters-website/
├── index.html          ← Homepage (hero, concept, latest episodes, platform links, next episode teaser)
├── episodes.html       ← All episodes page (full grid of all episodes)
├── watching.html       ← What We're Watching page (filterable grid: status × person × year)
├── about.html          ← About page (show description + host bios)
├── style.css           ← All styles (dark cinematic theme, gold accent #e8c96d)
├── episodes-data.js    ← Episode data array + NEXT_EPISODE teaser config
├── watching-data.js    ← Watching picks — auto-generated from Google Sheets (do not edit manually)
├── main.js             ← Nav toggle + episode card rendering + watching page logic
├── _headers            ← Cloudflare Pages security headers (CSP, X-Frame-Options, etc.)
├── .github/workflows/sync-watching.yml  ← Hourly GitHub Action: Google Sheets CSV → watching-data.js
└── CLAUDE.md           ← This file
```

---

## How the Site Works

- **No build tools.** Pure HTML, CSS, JavaScript. No npm, no webpack, nothing to install.
- **Episodes are data-driven.** All episode info lives in `episodes-data.js` as a JS array called `EPISODES`.
  Both `index.html` (shows latest 6 on desktop, 4 on mobile) and `episodes.html` (shows all) pull from this same array.
- **Next Episode teaser** is driven by `NEXT_EPISODE` in `episodes-data.js`. Set to `null` to hide the section.
- **Episode artwork** is hotlinked directly from the podcast RSS feed CDN (podcloud.fr).
- **What We're Watching** is a filterable page (`watching.html`) showing picks by Jess & Dima.
  Data lives in `watching-data.js` (auto-generated — do not edit manually).
  Managed via Google Sheets; a GitHub Actions workflow (`.github/workflows/sync-watching.yml`) fetches the sheet
  as CSV hourly and commits `watching-data.js` only when content has changed.
- **Fonts** are loaded from Google Fonts: Bebas Neue (display), DM Sans (body), Playfair Display (italic accents).
- **Security headers** are set in `_headers` (Cloudflare Pages format). CSP allowlists Cloudflare Insights, Google Fonts, and podcast image CDNs.

---

## Design System

| Element | Value |
|---------|-------|
| Background | `#0d0d0d` (near black) |
| Card background | `#1c1c1c` |
| Accent colour | `#e8c96d` (warm gold) |
| Danger/warning | `#c94b3a` (deep red) |
| Text | `#f0ece4` |
| Muted text | `#888` |
| Display font | Bebas Neue |
| Body font | DM Sans |
| Italic accent font | Playfair Display |

---

## About the Podcast

- **Name:** Couch Lobsters
- **Hosts:** Jess (Jessica Schaltin) & Dima (Dmytro)
- **Format:** Each episode, they assign each other a film or TV series to watch.
  Opinions are kept secret until recording day. Full spoilers throughout.
- **Tagline:** "The film & series podcast made by amateurs for cinema enthusiasts."
- **Episodes:** 25 published (as of March 2026), released roughly every 4–8 weeks
- **Based in:** Australia

### Platform Links
- Spotify: https://open.spotify.com/show/6KbzgmH3YRS2mc0cbjd82y
- Apple Podcasts: https://podcasts.apple.com/au/podcast/couch-lobsters/id1681472927
- Deezer: https://www.deezer.com/en/show/5945017
- Instagram: https://www.instagram.com/couchlobsters/
- Facebook: https://facebook.com/couchlobsters
- RSS Feed: https://couch-lobsters.lepodcast.fr/rss

### Host Social Links
- Dima Instagram: https://www.instagram.com/androidua/
- Dima Facebook: https://www.facebook.com/dima.bond
- Jess Instagram: https://www.instagram.com/jessschltn/
- Jess Facebook: https://www.facebook.com/jessica.schaltin
- Jess Bluesky: @Bad_Penguin

---

## How to Update the Next Episode Teaser

The teaser is the "Coming Soon" card on the homepage. It lives at the top of `episodes-data.js`.

**The user only needs to say:** the two film names (with years) and an expected date.
Claude should handle everything else — finding artwork URLs from TMDB and updating the file.

```javascript
const NEXT_EPISODE = {
  films: ["Film A (year)", "Film B (year)"],   // shown as "VS" on the card
  artworks: [
    "https://...",   // poster for Film A — use TMDB: https://www.themoviedb.org/
    "https://..."    // poster for Film B — use TMDB URL format: https://media.themoviedb.org/t/p/w500/POSTER_PATH.jpg
  ],
  teaser: null,           // optional one-line tagline e.g. "Two classics. One winner." — or null
  expectedDate: "April 2026"  // free-form string shown on the card — or null to omit
};
```

**To hide the teaser entirely** (e.g. between seasons): set `NEXT_EPISODE = null`.

**TMDB poster URL pattern:** `https://media.themoviedb.org/t/p/w500/POSTER_PATH.jpg`
Find it by searching the film on https://www.themoviedb.org/ and copying the poster path from the image URL.

---

## How to Add a New Episode

When a new episode is published, add it to the **top** of the `EPISODES` array
in `episodes-data.js`. Each episode object looks like this:

```javascript
{
  num: 28,                          // Episode number
  title: "Film A (year) VS Film B (year)",
  date: "2026-03-15",               // YYYY-MM-DD format
  duration: "1h 45m",
  artwork: "https://...",           // URL from RSS feed itunes:image tag
  spotifyUrl: "https://open.spotify.com/episode/...",
  appleUrl: "https://podcasts.apple.com/au/podcast/...",
  films: ["Film A (year)", "Film B (year)"]
}
```

To find the artwork URL and episode links for a new episode, check the RSS feed:
https://couch-lobsters.lepodcast.fr/rss

---

## Deploying Changes

After making any changes:

```bash
git add .
git commit -m "Brief description of what changed"
git push
```

Cloudflare Pages will auto-deploy within ~2 minutes.
The live site will be at couchlobsters.com once the custom domain is connected.

---

## Custom Domain Setup (Pending)

The domain `couchlobsters.com` is registered at Cloudflare Registrar.
The Cloudflare Pages project is called `couchlobsters-website`.
To connect the domain: Cloudflare Pages dashboard → project → Custom domains → Add `couchlobsters.com`.
Since the domain is already at Cloudflare, the DNS will update automatically.

---

## Versioning

Semantic versioning — bump in README badge + git tag in same commit:
- **Patch** (x.x.N): bug fixes, responsive tweaks, copy changes
- **Minor** (x.N.0): new features (e.g. teaser section, episode sync)
- **Major** (N.0.0): significant redesigns

```bash
git tag vX.Y.Z && git push origin vX.Y.Z
```

Current version: **v1.3.0**

### Pre-commit README checklist (minor and major bumps)

Before committing a **minor or major** version bump, always check:
- [ ] README version badge updated (`![Version](https://img.shields.io/badge/version-X.Y.Z-e8c96d)`)
- [ ] README **Tech Stack** still accurately describes how the site works
- [ ] README **Project Structure** lists all key files
- [ ] CLAUDE.md **File Structure** and **How the Site Works** are up to date

---

## Things Still To Do

- [ ] Connect couchlobsters.com custom domain to Cloudflare Pages project
- [x] Add favicon ✓
- [x] What We're Watching page with Google Sheets sync ✓
- [ ] Consider adding individual episode pages (optional — not planned yet)
- [ ] Add host photos to About page when available
- [ ] Update episode data whenever new episodes are published (or let GitHub Actions sync do it)

---

## SEO Standards

Every page must maintain all of the following. Never add a page without them.

### Required per-page tags
- `<title>` — unique, descriptive, under ~60 characters
- `<meta name="description">` — unique, 140–160 characters
- `<link rel="canonical">` — full absolute URL
- `<link rel="alternate" type="application/rss+xml">` — podcast RSS autodiscovery

### Open Graph (all required)
```html
<meta property="og:type" content="website">
<meta property="og:site_name" content="Couch Lobsters">
<meta property="og:locale" content="en_AU">
<meta property="og:url" content="https://couchlobsters.com/PAGE">
<meta property="og:title" content="…">
<meta property="og:description" content="…">
<meta property="og:image" content="…">
<meta property="og:image:width" content="640">
<meta property="og:image:height" content="640">
<meta property="og:image:alt" content="…">
```

### Twitter Card (all required)
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="…">
<meta name="twitter:description" content="…">
<meta name="twitter:image" content="…">
```

### JSON-LD structured data
- `index.html`: `PodcastSeries` + `WebSite` in a `@graph`
- `episodes.html`: `BreadcrumbList` (static) + `ItemList` of `PodcastEpisode` (injected by `main.js`)
- `watching.html` / `about.html`: `BreadcrumbList` (+ `Person` × 2 on about)
- `<script type="application/ld+json">` is CSP-exempt — no `script-src` changes needed

### sitemap.xml
All public pages must be listed with `<lastmod>` dates. Update `lastmod` whenever content on a page changes significantly. `watching.html` uses `changefreq="weekly"` (auto-synced from Sheets).

### Links
All external links must use `target="_blank" rel="noopener noreferrer"` — both attributes are required.

---

## Security Standards

Security headers live in `_headers` (Cloudflare Pages format). Keep all of these present:

| Header | Value | Purpose |
|--------|-------|---------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Forces HTTPS (HSTS) |
| `X-Frame-Options` | `DENY` | Blocks iframe embedding (legacy browsers) |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME-type sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limits referrer leakage |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=()` | Locks down browser APIs |
| `Content-Security-Policy` | See `_headers` for full allowlist | Controls allowed resource origins |
| `frame-ancestors 'none'` | Part of CSP | Modern clickjacking prevention |

### CSP rules
- No `'unsafe-inline'` in `style-src` — use CSS classes (`.is-visible` pattern) instead of inline styles in JS
- All new external image domains (e.g. TMDB posters, new CDNs) must be added to `img-src` in `_headers`
- `<script type="application/ld+json">` is data, not a script — CSP-exempt

### JS security practices (in `main.js`)
- All data inserted via `innerHTML` must pass through `escapeHtml()` — prevents XSS
- All URLs used in `href`/`src` attributes must pass through `safeUrl()` — prevents `javascript:` injection
- These two helpers must remain in place whenever new card types or data sources are added
