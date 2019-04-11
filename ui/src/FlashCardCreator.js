import React, { Component } from 'react';
import AudioSelector from './AudioSelector';
import ImageSelector from './ImageSelector';
import { query } from './shared/query';
import './FlashCardCreator.css';

const defaultState = {
  currentWord: '',
    imgUrls: [],
  selectedImgUrls: new Set(),
    mp3Urls: [],
  selectedMp3Url: undefined,
};

export default class FlashCardCreator extends Component {
  static defaultProps = {
    word: '',
    onSubmit: () => {},
  };

  constructor(props) {
    super(props);
    this.state = defaultState;

    this.submit = this.submit.bind(this);
    this.addSelectedImgUrl = this.addSelectedImgUrl.bind(this);
    this.deleteSelectedImgUrl = this.deleteSelectedImgUrl.bind(this);
    this.setSelectedMp3Url = this.setSelectedMp3Url.bind(this);
  }

  async componentWillReceiveProps({word}) {
    const {currentWord} = this.state;
    if (currentWord !== word) {
      if (word) {
        const {
          imgUrls,
          mp3Urls,
        } = await query(word);
        this.setState({
          imgUrls,
          mp3Urls,
          currentWord,
        });
      }
    }
  }

  submit() {
    this.props.onSubmit(new FlashCard({
      imageUrls: [...this.state.selectedImgUrls],
      audioUrl: this.state.selectedMp3Url,
    }));
  }

  addSelectedImgUrl(url) {
    this.state.selectedImgUrls.add(url);
    this.setState({selectedImgUrls: this.state.selectedImgUrls});
  }

  deleteSelectedImgUrl(url) {
    this.state.selectedImgUrls.delete(url);
    this.setState({selectedImgUrls: this.state.selectedImgUrls});
  }

  setSelectedMp3Url(url) {
    this.setState({selectedMp3Url: url});
  }

  render() {
    return (
      <div>
        <ImageSelector
            urls={this.state.imgUrls}
            onSelect={this.addSelectedImgUrl}
            onDeselect={this.deleteSelectedImgUrl}
        />
        <AudioSelector
            urls={this.state.mp3Urls}
            onSelectionChange={this.setSelectedMp3Url}
        />
        <button onClick={this.submit}>Submit</button>
      </div>
    );
  }
}

class FlashCard {
  constructor({imageUrls, audioUrl}) {
    this.imageUrls = imageUrls;
    this.audioUrl = audioUrl;
  }
}
