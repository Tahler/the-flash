import React, { Component } from 'react';
import { loadFlashCards } from './shared/storage';

export default class FlashCardManager extends Component {
  constructor(props) {
    super(props);

    this.state = {
      flashCards: loadFlashCards(),
    };

    this.download = this.download.bind(this);
  }

  download() {
    const header = 'name,images,audio,examples';
    const cardRows = this.state.flashCards.map(card => {
      const imgs = card.imageUrls.map(url => `<img src="${url}">`).join(';');
      const sound = `[sound:${card.audioUrl}]`;
      const fields = [card.word, imgs, sound, card.examples];
      return fields.join(',');
    });
    const rows = [header, ...cardRows];
    const content = rows.join('\n');
    downloadContent('flash_cards.csv', content);
  }

  render() {
    const cards = this.state.flashCards.map(card => (
        <div key={card.word}>
          <p>{card.word}</p>
          <div>
            {card.imageUrls.map(url => <img key={url} src={url} alt="" />)}
          </div>
          <div>
            <audio controls>
              <source src={card.audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
    ));
    return (
      <div>
        <button onClick={this.download}>Download</button>
        <div>
          {cards}
        </div>
      </div>
    );
  }
}

function downloadContent(fileName, content) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
  element.setAttribute('download', fileName);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
