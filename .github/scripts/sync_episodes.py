#!/usr/bin/env python3
"""
Sync new episodes from the Couch Lobsters RSS feed into episodes-data.js.

Runs daily via GitHub Actions. If new episodes are found (by itunes:episode
number), they are prepended to the EPISODES array in episodes-data.js and the
sitemap <lastmod> dates for the homepage and episodes page are refreshed.

Per-episode Apple Podcasts URLs are filled automatically from the iTunes
Lookup API. Spotify per-episode URLs are not available without authenticated
API access, so new episodes default to the show URL — the follow-up GitHub
issue (opened by the workflow) reminds us to paste the real link.
"""

import datetime
import re
import requests
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime

RSS_URL       = 'https://couch-lobsters.lepodcast.fr/rss'
ITUNES_LOOKUP = 'https://itunes.apple.com/lookup?id=1681472927&entity=podcastEpisode&limit=200'
DATA_FILE     = 'episodes-data.js'
SITEMAP_FILE  = 'sitemap.xml'
ITUNES_NS     = 'http://www.itunes.com/dtds/podcast-1.0.dtd'

SPOTIFY_SHOW_URL = 'https://open.spotify.com/show/6KbzgmH3YRS2mc0cbjd82y'
APPLE_SHOW_URL   = 'https://podcasts.apple.com/au/podcast/couch-lobsters/id1681472927'


def js_escape(s):
    """Escape a string for embedding inside a double-quoted JS string literal."""
    return s.replace('\\', '\\\\').replace('"', '\\"')


def norm_title(t):
    return re.sub(r'\s+', ' ', t.lower().strip())


def parse_duration(raw):
    """Convert '1:23:45', '83:45', or '5025' (seconds) → '1h 23m'."""
    if not raw:
        return ''
    raw = raw.strip()
    parts = raw.split(':')
    try:
        if len(parts) == 3:
            h, m = int(parts[0]), int(parts[1])
        elif len(parts) == 2:
            total_m = int(parts[0])
            h, m = divmod(total_m, 60)
        elif raw.isdigit():
            secs = int(raw)
            h, m = divmod(secs // 60, 60)
        else:
            return raw
    except ValueError:
        return raw
    return f'{h}h {m:02d}m' if h else f'{m}m'


def get_text(el, tag, ns=None):
    key = f'{{{ns}}}{tag}' if ns else tag
    found = el.find(key)
    return found.text.strip() if found is not None and found.text else None


def get_attr(el, tag, attr, ns=None):
    key = f'{{{ns}}}{tag}' if ns else tag
    found = el.find(key)
    return found.get(attr, '').strip() if found is not None else ''


def fetch_apple_urls():
    """Return (by_date, by_title) maps → per-episode Apple Podcasts URLs."""
    try:
        resp = requests.get(ITUNES_LOOKUP, timeout=20)
        resp.raise_for_status()
        results = resp.json().get('results', [])
    except Exception as exc:
        print(f'  ⚠ iTunes lookup failed ({exc}) — new episodes get the show URL.')
        return {}, {}

    by_date, by_title = {}, {}
    for r in results:
        if r.get('kind') != 'podcast-episode':
            continue
        url = r.get('trackViewUrl', '')
        if not url:
            continue
        url = url.replace('podcasts.apple.com/us/', 'podcasts.apple.com/au/')
        url = re.sub(r'&uo=\d+$', '', url)
        by_date[r.get('releaseDate', '')[:10]] = url
        by_title[norm_title(r.get('trackName', ''))] = url
    return by_date, by_title


def fetch_rss():
    resp = requests.get(RSS_URL, timeout=20)
    resp.raise_for_status()
    root = ET.fromstring(resp.content)
    episodes = []

    for item in root.find('channel').findall('item'):
        title    = get_text(item, 'title') or ''
        pub_date = get_text(item, 'pubDate') or ''
        num_str  = get_text(item, 'episode', ITUNES_NS)
        duration = parse_duration(get_text(item, 'duration', ITUNES_NS))
        artwork  = get_attr(item, 'image', 'href', ITUNES_NS)

        try:
            date = parsedate_to_datetime(pub_date).strftime('%Y-%m-%d')
        except Exception:
            date = ''

        if not num_str or not num_str.isdigit():
            print(f'  Skipping "{title}" — no itunes:episode tag found.')
            continue

        films = [f.strip() for f in title.split(' VS ')] if ' VS ' in title else [title]

        episodes.append({
            'num':      int(num_str),
            'title':    title,
            'date':     date,
            'duration': duration,
            'artwork':  artwork,
            'films':    films,
        })

    return episodes


def existing_nums():
    with open(DATA_FILE) as f:
        content = f.read()
    return {int(m) for m in re.findall(r'\bnum:\s*(\d+)', content)}


def format_entry(ep, apple_by_date, apple_by_title):
    apple_url = (
        apple_by_date.get(ep['date'])
        or apple_by_title.get(norm_title(ep['title']))
        or APPLE_SHOW_URL
    )
    films = ', '.join(f'"{js_escape(f)}"' for f in ep['films'])
    return (
        f'  {{\n'
        f'    num: {ep["num"]},\n'
        f'    title: "{js_escape(ep["title"])}",\n'
        f'    date: "{ep["date"]}",\n'
        f'    duration: "{js_escape(ep["duration"])}",\n'
        f'    artwork: "{js_escape(ep["artwork"])}",\n'
        f'    spotifyUrl: "{SPOTIFY_SHOW_URL}",\n'
        f'    appleUrl: "{js_escape(apple_url)}",\n'
        f'    films: [{films}]\n'
        f'  }}'
    )


def update_sitemap_lastmod(today):
    """Refresh <lastmod> for pages whose content changes when episodes land."""
    with open(SITEMAP_FILE) as f:
        xml = f.read()
    for page in ('https://couchlobsters.com/', 'https://couchlobsters.com/episodes.html'):
        xml = re.sub(
            rf'(<loc>{re.escape(page)}</loc>\s*<lastmod>)\d{{4}}-\d{{2}}-\d{{2}}(</lastmod>)',
            rf'\g<1>{today}\g<2>',
            xml,
        )
    with open(SITEMAP_FILE, 'w') as f:
        f.write(xml)


def main():
    print(f'Fetching {RSS_URL} …')
    rss     = fetch_rss()
    known   = existing_nums()
    new_eps = sorted(
        [ep for ep in rss if ep['num'] not in known],
        key=lambda e: e['num'],
        reverse=True   # newest first → prepend in correct order
    )

    if not new_eps:
        print('No new episodes found.')
        return

    nums = [ep['num'] for ep in new_eps]
    print(f'New episode(s) detected: {nums}')

    apple_by_date, apple_by_title = fetch_apple_urls()

    with open(DATA_FILE) as f:
        content = f.read()

    marker  = 'const EPISODES = ['
    pos     = content.index(marker) + len(marker)
    entries = ',\n'.join(format_entry(ep, apple_by_date, apple_by_title) for ep in new_eps)
    content = content[:pos] + '\n' + entries + ',\n' + content[pos:]

    with open(DATA_FILE, 'w') as f:
        f.write(content)

    update_sitemap_lastmod(datetime.date.today().isoformat())

    print(f'✓ Added {len(new_eps)} episode(s) to {DATA_FILE}; sitemap lastmod refreshed.')
    print('  ⚠ Spotify links default to the show URL — paste per-episode links when available.')


if __name__ == '__main__':
    main()
