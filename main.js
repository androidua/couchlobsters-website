// ============================================
// COUCH LOBSTERS — Main JS
// ============================================

// Nav mobile toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('open');
  });

  // Close nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  // Close nav when clicking outside
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
      navLinks.classList.remove('open');
    }
  });
}

// Podcast cover used as fallback when episode artwork fails to load.
// Self-hosted so it doesn't depend on Spotify CDN availability.
const ARTWORK_FALLBACK = 'https://couchlobsters.com/favicon.jpg';

// Attach error-fallback listeners to all [data-fallback] images in a container.
// Using addEventListener (not onerror="...") keeps us CSP-compliant — inline
// event handler attributes are treated as unsafe-inline by script-src.
// data-fallback="" or "remove" → remove the img element (e.g. teaser posters)
// data-fallback="<url>"       → replace src with that URL (e.g. episode artwork)
function attachImageFallbacks(container) {
  container.querySelectorAll('img[data-fallback]').forEach(function(img) {
    function applyFallback() {
      const fb = img.dataset.fallback;
      if (!fb || fb === 'remove') {
        img.remove();
      } else {
        img.addEventListener('error', function() { img.remove(); }, { once: true });
        img.src = fb;
      }
    }
    // Handle images that already failed before this listener was attached
    if (img.complete && !img.naturalWidth && img.getAttribute('src')) {
      applyFallback();
      return;
    }
    img.addEventListener('error', function onErr() {
      img.removeEventListener('error', onErr);
      applyFallback();
    }, { once: true });
  });
}

// Escape HTML to prevent XSS when injecting episode data into innerHTML
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Validate URLs — only allow https:// to prevent javascript: injection
function safeUrl(url) {
  return typeof url === 'string' && url.startsWith('https://') ? url : '#';
}

// Episode card builder
function buildEpisodeCard(ep) {
  const date = formatDate(ep.date);
  return `
    <div class="episode-card">
      <div class="episode-card-artwork-wrap">
        <img
          class="episode-card-artwork"
          src="${safeUrl(ep.artwork)}"
          alt="${escapeHtml(ep.title)}"
          loading="lazy"
          data-fallback="${ARTWORK_FALLBACK}"
        >
      </div>
      <div class="episode-card-body">
        <div class="episode-card-meta">
          <span class="episode-card-num">EP ${escapeHtml(ep.num)}</span>
          <span class="episode-card-duration">${escapeHtml(ep.duration)}</span>
        </div>
        <div class="episode-card-title">${escapeHtml(ep.title)}</div>
        <div class="episode-card-date">${escapeHtml(date)}</div>
        <div class="episode-card-links">
          <a href="${safeUrl(ep.spotifyUrl)}" target="_blank" rel="noopener noreferrer" class="ep-link ep-link-spotify">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
            Spotify
          </a>
          <a href="${safeUrl(ep.appleUrl)}" target="_blank" rel="noopener noreferrer" class="ep-link ep-link-apple">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>
            Apple
          </a>
        </div>
      </div>
    </div>
  `;
}

// Build the next-episode teaser card
function buildTeaserCard(next) {
  const film1 = next.films[0] || '';
  const film2 = next.films[1] || '';
  const art1 = next.artworks && safeUrl(next.artworks[0]) !== '#' ? next.artworks[0] : null;
  const art2 = next.artworks && safeUrl(next.artworks[1]) !== '#' ? next.artworks[1] : null;

  const artImg1 = art1 ? `<img src="${art1}" alt="${escapeHtml(film1)} poster" class="teaser-film-poster" loading="lazy" data-fallback="remove">` : '';
  const artImg2 = art2 ? `<img src="${art2}" alt="${escapeHtml(film2)} poster" class="teaser-film-poster" loading="lazy" data-fallback="remove">` : '';

  const badge = next.expectedDate
    ? `<span class="teaser-badge">Coming Soon · ${escapeHtml(next.expectedDate)}</span>`
    : `<span class="teaser-badge">Coming Soon</span>`;

  const tagline = next.teaser
    ? `<p class="teaser-tagline">"${escapeHtml(next.teaser)}"</p>`
    : '';

  return `
    <div class="teaser-card">
      <div class="teaser-header">
        <span class="teaser-label">◆ Next Episode</span>
        ${badge}
      </div>
      <div class="teaser-films">
        <div class="teaser-film">
          <div class="teaser-film-art teaser-film-art--a">${artImg1}</div>
          <p class="teaser-film-title">${escapeHtml(film1)}</p>
        </div>
        <div class="teaser-vs">VS</div>
        <div class="teaser-film">
          <div class="teaser-film-art teaser-film-art--b">${artImg2}</div>
          <p class="teaser-film-title">${escapeHtml(film2)}</p>
        </div>
      </div>
      ${tagline}
    </div>
  `;
}

// Render next episode teaser on homepage
const teaserSection = document.getElementById('nextEpisodeSection');
const teaserContainer = document.getElementById('nextEpisodeTeaser');
if (teaserSection && teaserContainer && typeof NEXT_EPISODE !== 'undefined' && NEXT_EPISODE) {
  teaserContainer.innerHTML = buildTeaserCard(NEXT_EPISODE);
  attachImageFallbacks(teaserContainer);
  teaserSection.classList.add('is-visible');
}

// Render latest episodes on homepage (show 6 most recent)
const latestContainer = document.getElementById('latestEpisodes');
if (latestContainer && typeof EPISODES !== 'undefined') {
  const latest = EPISODES.slice(0, 6);
  latestContainer.innerHTML = latest.map(buildEpisodeCard).join('');
  attachImageFallbacks(latestContainer);
  const allLink = document.getElementById('allEpisodesLink');
  if (allLink) allLink.textContent = `All ${EPISODES.length} episodes →`;
}

// Render ALL episodes on episodes page
const allContainer = document.getElementById('allEpisodes');
if (allContainer && typeof EPISODES !== 'undefined') {
  allContainer.innerHTML = EPISODES.map(buildEpisodeCard).join('');
  attachImageFallbacks(allContainer);
  const countEl = document.getElementById('episodeCount');
  if (countEl) countEl.textContent = `${EPISODES.length} episodes`;

  // Inject episode ItemList JSON-LD for SEO (keeps structured data in sync with episode array)
  const episodeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': 'Couch Lobsters Episodes',
    'url': 'https://couchlobsters.com/episodes.html',
    'numberOfItems': EPISODES.length,
    'itemListElement': EPISODES.map((ep, i) => ({
      '@type': 'ListItem',
      'position': i + 1,
      'item': {
        '@type': 'PodcastEpisode',
        'name': ep.title,
        'url': ep.spotifyUrl,
        'datePublished': ep.date,
        'timeRequired': ep.duration,
        'image': ep.artwork,
        'partOfSeries': {
          '@type': 'PodcastSeries',
          'name': 'Couch Lobsters',
          'url': 'https://couchlobsters.com/'
        }
      }
    }))
  };
  const ldScript = document.createElement('script');
  ldScript.type = 'application/ld+json';
  ldScript.textContent = JSON.stringify(episodeJsonLd);
  document.head.appendChild(ldScript);
}


// ============================================
// WHAT WE'RE WATCHING
// ============================================

// Format "2026-02" → "Feb 2026"
function formatWatchDate(dateStr) {
  const parts = String(dateStr).split('-');
  if (parts.length < 2) return dateStr;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const idx = parseInt(parts[1], 10) - 1;
  if (idx < 0 || idx > 11 || isNaN(idx)) return dateStr;
  return `${months[idx]} ${parts[0]}`;
}

// Build a single watch card (used on both homepage teaser and full page)
function buildWatchCard(item) {
  const statusKey = {
    'Watching':      'watching',
    'Watched':       'watched',
    'Want to Watch': 'want'
  }[item.status] || 'want';

  const whoClass = item.who === 'Jess' ? 'jess' : 'dima';
  const initial  = escapeHtml(item.who.charAt(0));
  const date     = escapeHtml(formatWatchDate(item.date));
  const note     = item.notes
    ? `<p class="watch-note">\u201c${escapeHtml(item.notes)}\u201d</p>`
    : '';

  return `
    <div class="watch-card" data-status="${escapeHtml(item.status)}" data-who="${escapeHtml(item.who)}">
      <div class="watch-card-top">
        <span class="watch-type-badge">${escapeHtml(item.type)}</span>
        <span class="watch-status-badge watch-status--${statusKey}">${escapeHtml(item.status)}</span>
      </div>
      <div class="watch-title">${escapeHtml(item.title)}</div>
      <div class="watch-meta">
        <div class="watch-avatar watch-avatar--${whoClass}">${initial}</div>
        <div class="watch-meta-text">
          <span class="watch-who">${escapeHtml(item.who)}</span>
          <span aria-hidden="true">·</span>
          <span>${date}</span>
        </div>
      </div>
      ${note}
    </div>
  `;
}

// ── Homepage: "Currently Watching" two-column host split ─────────────────────
const watchingTeaserEl = document.getElementById('watchingTeaser');
if (watchingTeaserEl && typeof WATCHING !== 'undefined') {
  const current   = WATCHING.filter(i => i.status === 'Watching');
  const jessItems = current.filter(i => i.who === 'Jess').slice(0, 2);
  const dimaItems = current.filter(i => i.who === 'Dima').slice(0, 2);

  const renderHostCol = (name, items, cls) => {
    const cards = items.length
      ? items.map(buildWatchCard).join('')
      : `<p class="watch-empty">Nothing on rotation right now.</p>`;
    return `
      <div class="watching-host-col">
        <div class="watching-host-label">
          <div class="watch-avatar watch-avatar--${cls}">${name.charAt(0)}</div>
          <span>${escapeHtml(name)}</span>
        </div>
        ${cards}
      </div>
    `;
  };

  watchingTeaserEl.innerHTML =
    renderHostCol('Jess', jessItems, 'jess') +
    renderHostCol('Dima', dimaItems, 'dima');
}

// ── Full watching page: filterable grid ──────────────────────────────────────
const watchGridEl = document.getElementById('watchGrid');
if (watchGridEl && typeof WATCHING !== 'undefined') {
  let activeStatus = 'all';
  let activePerson = 'all';
  let activeYear   = 'all';

  // Build year pills from the data; only reveal the group when 2+ distinct years exist.
  // Years are derived from item.date ("YYYY-MM") — no HTML changes needed when new years arrive.
  const yearWrapperEl = document.getElementById('yearFilterWrapper');
  if (yearWrapperEl) {
    const years = [...new Set(WATCHING.map(i => String(i.date).split('-')[0]))].sort((a, b) => b - a);
    if (years.length >= 2) {
      const yearGroupEl = document.getElementById('yearFilters');
      if (yearGroupEl) {
        yearGroupEl.innerHTML =
          '<button class="watch-filter-btn active" data-filter-year="all">All</button>' +
          years.map(y => `<button class="watch-filter-btn" data-filter-year="${escapeHtml(y)}">${escapeHtml(y)}</button>`).join('');
      }
      yearWrapperEl.classList.add('is-visible');
    }
  }

  function renderWatchGrid() {
    const filtered = WATCHING.filter(item => {
      const statusOk = activeStatus === 'all' || item.status === activeStatus;
      const personOk = activePerson === 'all' || item.who === activePerson;
      const yearOk   = activeYear   === 'all' || String(item.date).split('-')[0] === activeYear;
      return statusOk && personOk && yearOk;
    });

    watchGridEl.innerHTML = filtered.length
      ? filtered.map(buildWatchCard).join('')
      : '<p class="watch-empty watch-empty--full">Nothing matches those filters yet.</p>';

    const countEl = document.getElementById('watchCount');
    if (countEl) {
      countEl.textContent = `${filtered.length} ${filtered.length === 1 ? 'pick' : 'picks'}`;
    }
  }

  // Wire status filter buttons
  document.querySelectorAll('[data-filter-status]').forEach(btn => {
    btn.addEventListener('click', () => {
      activeStatus = btn.dataset.filterStatus;
      document.querySelectorAll('[data-filter-status]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderWatchGrid();
    });
  });

  // Wire person filter buttons
  document.querySelectorAll('[data-filter-person]').forEach(btn => {
    btn.addEventListener('click', () => {
      activePerson = btn.dataset.filterPerson;
      document.querySelectorAll('[data-filter-person]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderWatchGrid();
    });
  });

  // Wire year filter buttons (dynamically inserted above when 2+ years of data exist)
  document.querySelectorAll('[data-filter-year]').forEach(btn => {
    btn.addEventListener('click', () => {
      activeYear = btn.dataset.filterYear;
      document.querySelectorAll('[data-filter-year]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderWatchGrid();
    });
  });

  renderWatchGrid();
}
