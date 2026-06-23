// agenda settings
const AGENDA_ID = 21769447;
const API_KEY = 'oa_pk_tNHCjLcxHWeImghfqgAhFRCyyIZPutcsIIMpgCbMGdpIIrrisqqdDuGZDpaWQyIE';
const PER_PAGE = 9;
const FETCH_SIZE = 300;

// icons
const ICONS = {
  concert: 'ri-music-fill',
  exhibition: 'ri-gallery-fill',
  theater: 'ri-movie-fill',
  festival: 'ri-star-fill',
  default: 'ri-calendar-event-fill',
};

// app data
let currentPage = 1;
let activeCategory = 'all';
let searchQuery = '';

// html elements
const grid = document.getElementById('events-grid');
const status = document.getElementById('status');
const countEl = document.getElementById('events-count');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageInfo = document.getElementById('page-info');
const pagination = document.getElementById('pagination');
const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');

// find category
function getCategory(event) {
  const text = [
    ...(event.keywords?.fr || []),
    ...(event.conditions?.fr || [])
  ].join(' ').toLowerCase();

  if (text.includes('concert') || text.includes('musique')) return 'concert';
  if (text.includes('exposition') || text.includes('art')) return 'exhibition';
  if (text.includes('théâtre') || text.includes('spectacle')) return 'theater';
  if (text.includes('festival')) return 'festival';

  return 'default';
}

// get events list
async function fetchEvents() {
  const url =
    `https://api.openagenda.com/v2/agendas/${AGENDA_ID}/events` +
    `?key=${API_KEY}&size=${FETCH_SIZE}&lang=fr` +
    (searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '');

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('API error: ' + response.status);
  }

  return response.json();
}

// create one card
function createCard(event) {
  const category = getCategory(event);

  const title = event.title?.fr || 'No title';
  const place = event.location?.name || 'No location';

  // short description for home page
  const shortDesc =
    event.description?.fr ||
    event.shortDescription?.fr ||
    'No description';

  // small image for home page
  const image = event.image?.base
    ? event.image.base + (event.image.filename || '')
    : null;

  const date = event.firstTiming?.begin
    ? new Date(event.firstTiming.begin).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : 'No date';

  const icon = ICONS[category] || ICONS.default;

  const li = document.createElement('li');
  li.className = 'event-card';
  li.setAttribute('data-category', category);

  li.innerHTML = `
    ${image
      ? `<img class="card__image" src="${image}" alt="${title}" loading="lazy">`
      : `<div class="card__placeholder"><i class="${icon}"></i></div>`}

    <div class="card__body">
      <p class="card__category"><i class="${icon}"></i> ${category}</p>
      <h3 class="card__title">${title}</h3>
      <p class="card__description">${shortDesc}</p>

      <div class="card__meta">
        <span><i class="ri-calendar-event-fill"></i> ${date}</span>
        <span><i class="ri-map-pin-fill"></i> ${place}</span>
      </div>
    </div>
  `;

  // send uid to detail page
  const id = event.uid || event.id;

  li.addEventListener('click', () => {
    window.location.href = `event-detail.html?id=${id}`;
  });

  return li;
}

// show events
async function loadEvents() {
  grid.innerHTML = '';
  status.textContent = 'Loading...';

  try {
    const data = await fetchEvents();
    let events = data.events || [];

    // filter by category
    if (activeCategory !== 'all') {
      events = events.filter(event => getCategory(event) === activeCategory);
    }

    if (events.length === 0) {
      status.textContent = 'No events found';
      pagination.hidden = true;
      countEl.textContent = '0 events';
      return;
    }

    // pagination
    const start = (currentPage - 1) * PER_PAGE;
    const pageEvents = events.slice(start, start + PER_PAGE);

    pageEvents.forEach(event => {
      grid.appendChild(createCard(event));
    });

    countEl.textContent = `${events.length} events`;
    status.textContent = '';

    updatePagination(events.length);

  } catch (error) {
    console.error(error);
    status.textContent = 'API loading error';
  }
}

// update pagination
function updatePagination(total) {
  const totalPages = Math.ceil(total / PER_PAGE);

  pagination.hidden = totalPages <= 1;
  prevBtn.disabled = currentPage <= 1;
  nextBtn.disabled = currentPage >= totalPages;

  pageInfo.textContent = `Page ${currentPage} / ${totalPages}`;
}

// filter buttons
document.querySelectorAll('.filter__btn').forEach(btn => {
  btn.addEventListener('click', () => {
    activeCategory = btn.dataset.category;
    currentPage = 1;
    loadEvents();
  });
});

// search button
searchBtn.addEventListener('click', () => {
  searchQuery = searchInput.value.trim();
  currentPage = 1;
  loadEvents();
});

// search with Enter key
searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    searchQuery = searchInput.value.trim();
    currentPage = 1;
    loadEvents();
  }
});

// previous page
prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    loadEvents();
  }
});

// next page
nextBtn.addEventListener('click', () => {
  currentPage++;
  loadEvents();
});

// start app
loadEvents();