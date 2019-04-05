import React, { Component } from 'react';
import MultiCardCreator from './MultiCardCreator';
import WordListEntry from './WordListEntry';
import './App.css';

const stage = {
  wordListEntry: 0,
  createFlashCards: 1,
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: stage.wordListEntry,
      words: [],
    };
    this.receiveWords = this.receiveWords.bind(this);
  }

  receiveWords(words) {
    this.setState({
      stage: stage.createFlashCards,
      words,
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
                onComplete={cards => console.log(cards)}
            >
            </MultiCardCreator>
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
