import React, { Component } from 'react';
import MultiCardCreator from './MultiCardCreator';
import WordListEntry from './WordListEntry';
import { loadFlashCards, saveFlashCards } from './shared/storage';
import './App.css';

const stage = {
  wordListEntry: 0,
  createFlashCards: 1,
  complete: 2,
};

export default class App extends Component {
  constructor(props) {
    super(props);
    const preloadedFlashCards = loadFlashCards();
    this.state = {
      stage: preloadedFlashCards ? stage.complete : stage.wordListEntry,
      words: [],
      flashCards: preloadedFlashCards || [],
    };
    this.receiveWords = this.receiveWords.bind(this);
    this.receiveFlashCards = this.receiveFlashCards.bind(this);
  }

  receiveWords(words) {
    this.setState({
      stage: stage.createFlashCards,
      words,
    })
  }

  receiveFlashCards(flashCards) {
    saveFlashCards(flashCards);
    this.setState({
      stage: stage.complete,
      flashCards,
    })
  }

  render() {
    let content;
    switch (this.state.stage) {
      case stage.wordListEntry:
        content = <WordListEntry onSubmit={this.receiveWords}></WordListEntry>;
        break;
      case stage.createFlashCards:
        content = (
            <MultiCardCreator
                words={this.state.words}
                onComplete={this.receiveFlashCards}
            >
            </MultiCardCreator>
        );
        break;
      case stage.complete:
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
