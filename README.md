# Couch Lobsters — Podcast Website

![Version](https://img.shields.io/badge/version-1.0.6-e8c96d) ![Deployed on Cloudflare Pages](https://img.shields.io/badge/hosted-Cloudflare%20Pages-orange)

The official website for **Couch Lobsters**, a film & TV series podcast hosted by Jess & Dima.

**Live site:** [couchlobsters.com](https://couchlobsters.com)

---

## About the Podcast

Each episode, Jess & Dima assign each other a film or TV series to watch — opinions are kept secret until recording day. Full spoilers throughout.

> "The film & series podcast made by amateurs for cinema enthusiasts."

**Listen on:**
- [Spotify](https://open.spotify.com/show/6KbzgmH3YRS2mc0cbjd82y)
- [Apple Podcasts](https://podcasts.apple.com/au/podcast/couch-lobsters/id1681472927)
- [Deezer](https://www.deezer.com/en/show/5945017)

**Follow us:**
- [Instagram](https://www.instagram.com/couchlobsters/)
- [Facebook](https://facebook.com/couchlobsters)

---

## Tech Stack

- Pure HTML, CSS, and JavaScript — no frameworks, no build step
- Hosted on [Cloudflare Pages](https://pages.cloudflare.com/) — auto-deploys on push to `main`
- Episode data driven from a single JS array in `episodes-data.js`
- Episode artwork hotlinked from the podcast RSS feed CDN

## Project Structure

```
├── index.html        — Homepage (hero, latest episodes, platform links)
├── episodes.html     — All episodes grid
├── about.html        — About the show and hosts
├── style.css         — Dark cinematic theme, gold accent #e8c96d
├── episodes-data.js  — Episode data array (titles, dates, artwork, links)
└── main.js           — Nav toggle + episode card rendering
```

---

## Versioning

This project follows [Semantic Versioning](https://semver.org/) (`MAJOR.MINOR.PATCH`):

| Bump | When to use | Example change |
|------|-------------|----------------|
| **Major** (`v2.0.0`) | Significant new features | Donations, membership, player |
| **Minor** (`v1.1.0`) | New pages or sections | New About section, search page |
| **Patch** (`v1.0.1`) | Small updates | Episode added, text fix, spelling |

See all releases on the [Tags page](https://github.com/androidua/couchlobsters-website/tags).
