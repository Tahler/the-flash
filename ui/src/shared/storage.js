// TODO: Does this really have to be in JSON?

export function loadFlashCards() {
  const json = localStorage.flashCards;
  return json === undefined ?
      [] :
      JSON.parse(json);
}

export function saveFlashCards(flashCards) {
  localStorage.flashCards = JSON.stringify(flashCards);
}
