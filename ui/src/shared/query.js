async function fetchJson(url) {
  return fetch(url).then(response => response.json());
}

export async function queryImages(query, pageNum=0, pageSize=3) {
  const encodedQuery = encodeURIComponent(query);
  return fetchJson(`http://localhost:5000/images/google/${encodedQuery}/${pageSize}/${pageNum}`);
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
