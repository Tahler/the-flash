async function fetchJson(url) {
  return fetch(url).then(response => response.json());
}

export async function queryImages(query, offset=0, size=3) {
  const encodedQuery = encodeURIComponent(query);
  return fetchJson(`http://localhost:5000/images/google/${encodedQuery}/${offset}/${size}`);
}

async function queryAudio(query, offset=0, size=3) {
  const encodedQuery = encodeURIComponent(query);
  return fetchJson(`http://localhost:5000/audio/forvo/${encodedQuery}/${offset}/${size}`);
}

export async function query(query) {
  return Promise.all([
    queryImages(query),
    queryAudio(query),
  ]).then(([imgUrls, mp3Urls]) => ({imgUrls, mp3Urls}));
}
