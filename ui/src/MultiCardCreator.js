import React, { Component } from 'react';
import { query } from './shared/query';
import FlashCardCreator from './FlashCardCreator';

export default class MultiCardCreator extends Component {
  static defaultProps = {
    words: [],
    onComplete: () => {},
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
    if (!nextWord) {
      throw new Error(`no word at index ${nextWordIndex}`);
    }
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
      wordIndex,
    } = this.state;
    const {
      onComplete,
      words,
    } = this.props;

    const completeFlashCard = {
      ...flashCard,
      word,
    };
    const appendedFlashCards = [
      ...flashCards,
      completeFlashCard,
    ];
    this.setState({
      flashCards: appendedFlashCards,
    });

    const hasMoreWords = wordIndex + 1 < words.length;
    if (hasMoreWords) {
      this.nextWord();
    } else {
      onComplete(appendedFlashCards);
    }
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
