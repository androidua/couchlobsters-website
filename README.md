# Couch Lobsters — Podcast Website

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
