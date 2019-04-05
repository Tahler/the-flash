import React, { Component } from 'react';
import { query } from './shared/query';
import FlashCardCreator from './FlashCardCreator';

export default class MultiCardCreator extends Component {
  static defaultProps = {
    words: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      flashCards: [],
      wordIndex: -1,
      word: undefined,
      imgUrls: [],
      mp3Urls: [],
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.nextWord();
  }

  async nextWord() {
    const nextWordIndex = this.state.wordIndex + 1;
    const nextWord = this.props.words[nextWordIndex];
    const {
      imgUrls,
      mp3Urls,
    } = await query(nextWord);
    this.setState({
      wordIndex: nextWordIndex,
      word: nextWord,
      imgUrls,
      mp3Urls,
    });
  }

  onSubmit(flashCard) {
    const {
      flashCards,
      word,
    } = this.state;

    const completeFlashCard = {
      word,
      ...flashCard,
    };
    this.setState({
      flashCards: [
        ...flashCards,
        completeFlashCard,
      ],
    });
    this.nextWord();
  }

  render() {
    const {
      imgUrls,
      mp3Urls,
    } = this.state;
    return (
      <FlashCardCreator
          imgUrls={imgUrls}
          mp3Urls={mp3Urls}
          onSubmit={this.onSubmit}
      />
    );
  }
}
