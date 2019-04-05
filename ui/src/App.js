import React, { Component } from 'react';
import MultiCardCreator from './MultiCardCreator';
import './App.css';

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <MultiCardCreator words={['montaña', 'casa', 'cabrero']}></MultiCardCreator>
      </div>
    );
  }
}
