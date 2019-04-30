async function fetchJson(url, params) {
  const queryString = Object.keys(params)
      .map(k => (k) + '=' + (params[k]))
      .join('&');
  const encodedUri = encodeURI(url + '?' + queryString);
  return fetch(encodedUri).then(response => response.json());
}

export async function queryImages(query, offset=0, size=3) {
  return fetchJson(`http://localhost:5000/images/google/${query}`, {offset, size});
}

export async function queryAudios(query, offset=0, size=2) {
  return fetchJson(`http://localhost:5000/audio/forvo/${query}`, {offset, size});
}

export async function queryExamples(query, offset=0, size=3) {
  return fetchJson(`http://localhost:5000/examples/tatoeba/${query}`, {offset, size});
}

export async function query(query) {
  return Promise.all([
    queryImages(query),
    queryAudios(query),
    queryExamples(query),
  ]).then(([imgUrls, mp3Urls, examples]) => ({imgUrls, mp3Urls, examples}));
}
