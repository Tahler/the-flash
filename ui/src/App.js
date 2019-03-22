import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <Search></Search>
      </div>
    );
  }
}

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      imgUrls: [],
      mp3Urls: [],
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({query: event.target.value});
  }

  query(query) {
    const encodedQuery = encodeURIComponent(query);
    Promise.all([
      fetch(`http://localhost:5000/images/google/${encodedQuery}`),
      fetch(`http://localhost:5000/audio/forvo/${encodedQuery}`),
    ])
      .then(responses => Promise.all(responses.map(response => response.json()))
      .then(([imgUrls, mp3Urls]) => this.setState({imgUrls, mp3Urls})))
  }

  render() {
    return (
      <div>
        <input type="text" name="query" value={this.state.query} onChange={this.handleChange} />
        <button onClick={() => this.query(this.state.query)}>Submit</button>
        <ImagePicker urls={this.state.imgUrls} />
        <hr />
        <AudioPicker urls={this.state.mp3Urls} />
      </div>
    );
  }
}

class ImagePicker extends Component {
  static defaultProps = {
    urls: [],
  };

  render() {
    const imgs = this.props.urls.map(url =>
        <img src={url} alt="" className="result-img" key={url}></img>)
    return (
      <div>
        {imgs}
      </div>
    );
  }
}

class AudioPicker extends Component {
  static defaultProps = {
    urls: [],
  };

  render() {
    const audios = this.props.urls.map(url => (
      <audio key={url} controls>
        <source src={url} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    ));
    return (
      <div>
        {audios}
      </div>
    );
  }
}
