export async function query(query) {
  const encodedQuery = encodeURIComponent(query);
  return Promise.all([
    fetch(`http://localhost:5000/images/google/${encodedQuery}`),
    fetch(`http://localhost:5000/audio/forvo/${encodedQuery}`),
  ])
    .then(responses => Promise.all(responses.map(response => response.json()))
    .then(([imgUrls, mp3Urls]) => ({imgUrls, mp3Urls})));
}
