// TODO: Does this really have to be in JSON?

export function loadFlashCards() {
  const json = localStorage.flashCards;
  return json === undefined ?
      [] :
      JSON.parse(json);
}

export function appendFlashCards(flashCards) {
  const currentFlashCards = loadFlashCards();
  const newFlashCards = [...currentFlashCards, ...flashCards];
  localStorage.flashCards = JSON.stringify(newFlashCards);
}
