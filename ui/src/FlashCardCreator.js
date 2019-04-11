import React, { Component } from 'react';
import ImageSelector from './ImageSelector';
import SelectableAudio from './SelectableAudio';
import { query } from './shared/query';
import './FlashCardCreator.css';

export default class FlashCardCreator extends Component {
  static defaultProps = {
    word: '',
    onSubmit: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      imgUrls: [],
      mp3Urls: [],
      flashCard: {},
    };

    this.submit = this.submit.bind(this);
    this.setSelectedImgUrls = this.setSelectedImgUrls.bind(this);
    this.setSelectedMp3Url = this.setSelectedMp3Url.bind(this);
  }

  async componentWillReceiveProps({word}) {
    const currentWord = this.state.flashCard.currentWord;
    if (currentWord !== word) {
      if (word) {
        const {
          imgUrls,
          mp3Urls,
        } = await query(word);
        this.setState({
          imgUrls,
          mp3Urls,
          flashCard: {word},
        });
      }
    }
  }

  submit() {
    this.props.onSubmit(this.state.currentFlashCard);
    this.setState({currentFlashCard: {}});
  }

  setSelectedImgUrls(selectedImgUrls) {
    this.setState({selectedImgUrls});
  }

  setSelectedMp3Url(url) {
    this.setState({selectedMp3Url: url});
  }

  render() {
    const {
      imgUrls,
      mp3Urls,
      selectedMp3Url,
    } = this.state;

    const audios = mp3Urls.map(url => (
        <SelectableAudio
            key={url}
            url={url}
            isSelected={selectedMp3Url === url}
            onSelect={() => this.setSelectedMp3Url(url)}
            onDeselect={() => this.setSelectedMp3Url(undefined)}
        />
    ));

    return (
      <div>
        <h3>{this.props.word}</h3>
        <ImageSelector imgUrls={imgUrls} onSelectionChange={this.setSelectedImgUrls} />
        <div className="selector">
          {audios}
        </div>
        <button onClick={this.submit}>Submit</button>
      </div>
    );
  }
}

let prev = [];

export class FlashCard {
  constructor({imageUrls, audioUrl}) {
    this.imageUrls = imageUrls;
    this.audioUrl = audioUrl;
  }
}
