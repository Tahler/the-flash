import React, { Component } from 'react';
import { query } from './shared/query';
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

  render() {
    return (
      <div>
        <input type="text" name="query" value={this.state.query} onChange={this.handleChange} />
        <button onClick={() => query(this.state.query)}>Submit</button>
        <FlashCardCreator
            imgUrls={this.state.imgUrls}
            mp3Urls={this.state.mp3Urls}
            onSubmit={(card) => console.log(card)}
        />
      </div>
    );
  }
}
