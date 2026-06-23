// agenda settings
const AGENDA_ID = 21769447;
const API_KEY = 'oa_pk_tNHCjLcxHWeImghfqgAhFRCyyIZPutcsIIMpgCbMGdpIIrrisqqdDuGZDpaWQyIE';


// format date
function formatDate(dateStr) {
  if (!dateStr) {
    return 'Not available';
  }

  const date = new Date(dateStr);

  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}


// format time
function formatTime(dateStr) {
  if (!dateStr) {
    return '';
  }

  const date = new Date(dateStr);

  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}


// get full event for detail page
async function fetchEventById(id) {
  const url =
    `https://api.openagenda.com/v2/agendas/${AGENDA_ID}/events/${id}` +
    `?key=${API_KEY}&lang=fr`;

  console.log('Loading detail event:', url);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('HTTP error ' + response.status);
  }

  const data = await response.json();

  return data.event || data;
}


// load event
async function loadEvent() {
  const id = new URLSearchParams(window.location.search).get('id');
  const status = document.getElementById('status');

  if (!id) {
    status.textContent = 'No event selected';
    return;
  }

  try {
    status.textContent = 'Loading...';

    const event = await fetchEventById(id);

    console.log(event);

    renderEvent(event);

    status.textContent = '';

  } catch (error) {
    console.error(error);
    status.textContent = 'Error loading event: ' + error.message;
  }
}


// show event on page
function renderEvent(event) {
  const title = event.title?.fr || 'No title';

  // full description for detail page
  const description =
    event.longDescription?.fr ||
    event.longDescription ||
    event.description?.fr ||
    'No description';

  const location = event.location?.name || 'Unknown place';

  const address = [
    event.location?.address,
    event.location?.city
  ].filter(Boolean).join(', ');

  const date = formatDate(event.firstTiming?.begin);
  const time = formatTime(event.firstTiming?.begin);

  const image = event.image?.base
    ? event.image.base + (event.image.filename || '')
    : null;

  document.title = title + ' - VillaNova';

  // big image
  if (image) {
    document.getElementById('event-hero').innerHTML = `
      <img src="${image}" alt="${title}">
    `;
  } else {
    document.getElementById('event-hero').innerHTML = `
      <div class="detail__placeholder">
        <i class="ri-calendar-event-fill"></i>
      </div>
    `;
  }

  // title
  document.getElementById('event-header').innerHTML = `
    <h1 class="event-detail__title">${title}</h1>
  `;

  // full description
  document.getElementById('event-description').innerHTML = description;

  // info box
  document.getElementById('event-info').innerHTML = `
    <ul>
      <li><strong>Date:</strong> ${date}</li>
      <li><strong>Time:</strong> ${time || 'Not available'}</li>
      <li><strong>Place:</strong> ${location}</li>
      <li><strong>Address:</strong> ${address || 'Not available'}</li>
    </ul>
  `;

  // reservation button
  const website = event.links?.[0]?.link;

  if (website) {
    document.getElementById('event-reservation').innerHTML = `
      <a href="${website}" target="_blank" class="btn btn--accent">
        Book / Reserve
      </a>
    `;
  }
}


document.addEventListener('DOMContentLoaded', loadEvent);