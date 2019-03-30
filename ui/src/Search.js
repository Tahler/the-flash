import React, { Component } from 'react';
import FlashCardCreator from './FlashCardCreator';

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: 'montaña',
      imgUrls: [
        'http://localhost:5000/static/montaña1.jpg',
        'http://localhost:5000/static/montaña2.jpg',
        'http://localhost:5000/static/montaña3.jpg',
      ],
      mp3Urls: [
        'http://localhost:5000/static/montaña1.mp3',
        'http://localhost:5000/static/montaña2.mp3',
        'http://localhost:5000/static/montaña3.mp3',
      ],
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
        <FlashCardCreator
            imgUrls={this.state.imgUrls}
            mp3Urls={this.state.mp3Urls}
            onSubmit={(card) => console.log(card)}
        />
      </div>
    );
  }
}
