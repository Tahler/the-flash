import React, { Component } from 'react';
import { loadFlashCards } from './shared/storage';

export default class FlashCardManager extends Component {
  constructor(props) {
    super(props);

    this.state = {
      flashCards: loadFlashCards(),
    };
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
        {cards}
      </div>
    );
  }
}
