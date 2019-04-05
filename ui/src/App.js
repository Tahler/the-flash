import React, { Component } from 'react';
import WordListEntry from './WordListEntry';
import './App.css';

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <WordListEntry onSubmit={words => console.log(words)}></WordListEntry>
      </div>
    );
  }
}
