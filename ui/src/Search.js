import React, { Component } from 'react';
import Picker from './Picker';

export default class Search extends Component {
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
        <Picker
            imgUrls={this.state.imgUrls}
            mp3Urls={this.state.mp3Urls}
            onSubmit={(card) => console.log(card)}
        />
      </div>
    );
  }
}
