import React, { Component } from 'react';
import MultiCardCreator from './MultiCardCreator';
import WordListEntry from './WordListEntry';
import { loadFlashCards, saveFlashCards } from './shared/storage';
import './App.css';

const page = {
  wordListEntry: 0,
  createFlashCards: 1,
  viewFlashCards: 2,
  menu: 3,
};

export default class App extends Component {
  constructor(props) {
    super(props);
    const preloadedFlashCards = loadFlashCards();
    this.state = {
      page: page.menu,
      words: [],
      flashCards: preloadedFlashCards || [],
    };
    this.receiveWords = this.receiveWords.bind(this);
    this.receiveFlashCards = this.receiveFlashCards.bind(this);
  }

  receiveWords(words) {
    this.setState({
      page: page.createFlashCards,
      words,
    })
  }

  receiveFlashCards(flashCards) {
    saveFlashCards(flashCards);
    this.setState({
      page: page.viewFlashCards,
      flashCards,
    })
  }

  render() {
    let content;
    switch (this.state.page) {
      case page.menu:
        content = (
          <div>
            <button onClick={() => this.setState({page: page.wordListEntry})}>
              Create Cards from Word List
            </button>
            <button onClick={() => this.setState({page: page.viewFlashCards})}>
              View Flash Cards
            </button>
          </div>
        );
        break;
      case page.wordListEntry:
        content = <WordListEntry onSubmit={this.receiveWords} />;
        break;
      case page.createFlashCards:
        content = (
            <MultiCardCreator
                words={this.state.words}
                onComplete={this.receiveFlashCards}
            />
        );
        break;
      case page.viewFlashCards:
        content = this.state.flashCards.map(card =>
            <div key={card.word}>
              <p>{card.word}</p>
              <div>
                {card.imageUrls.map(url => <img key={url} src={url} alt="" />)}
              </div>
              <div>
                <audio controls key={card.audioUrl}>
                  <source src={card.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
        );
        break;
      default:
        throw new Error('impossible');
    }
    return (
      <div className="App">
        {content}
      </div>
    );
  }
}
