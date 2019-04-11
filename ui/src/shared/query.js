async function fetchJson(url) {
  return fetch(url).then(response => response.json());
}

async function queryImages(query) {
  const encodedQuery = encodeURIComponent(query);
  return fetchJson(`http://localhost:5000/images/google/${encodedQuery}`);
}

async function queryAudio(query) {
  const encodedQuery = encodeURIComponent(query);
  return fetchJson(`http://localhost:5000/audio/forvo/${encodedQuery}`);
}

export async function query(query) {
  return Promise.all([
    queryImages(query),
    queryAudio(query),
  ]).then(([imgUrls, mp3Urls]) => ({imgUrls, mp3Urls}));
}
