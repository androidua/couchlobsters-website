#!/usr/bin/env python3
"""
Sync new episodes from the Couch Lobsters RSS feed into episodes-data.js.

Runs daily via GitHub Actions. If new episodes are found (by itunes:episode
number), they are prepended to the EPISODES array in episodes-data.js.

NOTE: spotifyUrl and appleUrl are left empty — add them manually after
the auto-commit, then push again.
"""

import re
import sys
import requests
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime

RSS_URL   = 'https://couch-lobsters.lepodcast.fr/rss'
DATA_FILE = 'episodes-data.js'
ITUNES    = 'http://www.itunes.com/dtds/podcast-1.0.dtd'


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


def fetch_rss():
    resp = requests.get(RSS_URL, timeout=20)
    resp.raise_for_status()
    root = ET.fromstring(resp.content)
    episodes = []

    for item in root.find('channel').findall('item'):
        title    = get_text(item, 'title') or ''
        pub_date = get_text(item, 'pubDate') or ''
        num_str  = get_text(item, 'episode', ITUNES)
        duration = parse_duration(get_text(item, 'duration', ITUNES))
        artwork  = get_attr(item, 'image', 'href', ITUNES)

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


def format_entry(ep):
    title = ep['title'].replace('\\', '\\\\').replace('"', '\\"')
    films = ', '.join(f'"{f}"' for f in ep['films'])
    return (
        f'  {{\n'
        f'    num: {ep["num"]},\n'
        f'    title: "{title}",\n'
        f'    date: "{ep["date"]}",\n'
        f'    duration: "{ep["duration"]}",\n'
        f'    artwork: "{ep["artwork"]}",\n'
        f'    spotifyUrl: "",\n'
        f'    appleUrl: "",\n'
        f'    films: [{films}]\n'
        f'  }}'
    )


def main():
    print(f'Fetching {RSS_URL} …')
    rss      = fetch_rss()
    known    = existing_nums()
    new_eps  = sorted(
        [ep for ep in rss if ep['num'] not in known],
        key=lambda e: e['num'],
        reverse=True   # newest first → prepend in correct order
    )

    if not new_eps:
        print('No new episodes found.')
        return

    nums = [ep['num'] for ep in new_eps]
    print(f'New episode(s) detected: {nums}')

    with open(DATA_FILE) as f:
        content = f.read()

    marker = 'const EPISODES = ['
    pos     = content.index(marker) + len(marker)
    entries = ',\n'.join(format_entry(ep) for ep in new_eps)
    content = content[:pos] + '\n' + entries + ',\n' + content[pos:]

    with open(DATA_FILE, 'w') as f:
        f.write(content)

    print(f'✓ Added {len(new_eps)} episode(s) to {DATA_FILE}.')
    print('  ⚠  spotifyUrl and appleUrl are empty — add them manually and push.')


if __name__ == '__main__':
    main()
