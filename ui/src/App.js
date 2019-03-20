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
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({query: event.target.value});
  }

  query(query) {
    const path = encodeURIComponent(query);
    const url = `http://localhost:5000/images/google/${path}`;
    fetch(url)
        .then(response => response.json())
        .then(imgUrls => this.setState({imgUrls}));
  }

  render() {
    return (
      <div>
        <input type="text" name="query" value={this.state.query} onChange={this.handleChange} />
        <button onClick={() => this.query(this.state.query)}>Submit</button>
        <Images urls={this.state.imgUrls} />
      </div>
    );
  }
}

class Images extends Component {
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
