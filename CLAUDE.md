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
├── about.html          ← About page (show description + host bios)
├── style.css           ← All styles (dark cinematic theme, gold accent #e8c96d)
├── episodes-data.js    ← Episode data array + NEXT_EPISODE teaser config
├── main.js             ← Nav toggle + episode card rendering logic
├── _headers            ← Cloudflare Pages security headers (CSP, X-Frame-Options, etc.)
└── CLAUDE.md           ← This file
```

---

## How the Site Works

- **No build tools.** Pure HTML, CSS, JavaScript. No npm, no webpack, nothing to install.
- **Episodes are data-driven.** All episode info lives in `episodes-data.js` as a JS array called `EPISODES`.
  Both `index.html` (shows latest 6 on desktop, 4 on mobile) and `episodes.html` (shows all) pull from this same array.
- **Next Episode teaser** is driven by `NEXT_EPISODE` in `episodes-data.js`. Set to `null` to hide the section.
- **Episode artwork** is hotlinked directly from the podcast RSS feed CDN (podcloud.fr).
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

Current version: **v1.0.6**

---

## Things Still To Do

- [ ] Connect couchlobsters.com custom domain to Cloudflare Pages project
- [x] Add favicon ✓
- [ ] Consider adding individual episode pages (optional — not planned yet)
- [ ] Add host photos to About page when available
- [ ] Update episode data whenever new episodes are published (or let GitHub Actions sync do it)
