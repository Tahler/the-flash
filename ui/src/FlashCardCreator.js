import React, { Component } from 'react';
import { SelectableAudio } from './AudioSelector';
import { SelectableImage } from './ImageSelector';
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
    this.selectImgUrl = this.selectImgUrl.bind(this);
    this.deselectImgUrl = this.deselectImgUrl.bind(this);
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
    console.log(defaultState);
    this.setState(defaultState);
  }

  selectImgUrl(url) {
    const selectedImgUrls = new Set([...this.state.selectedImgUrls, url]);
    this.setState({selectedImgUrls});
  }

  deselectImgUrl(url) {
    // TODO: find a better way to delete immutably.
    const selectedImgUrls = new Set(
        [...this.state.selectedImgUrls].filter(
            selectedUrl => url !== selectedUrl));
    this.setState({selectedImgUrls});
  }

  setSelectedMp3Url(url) {
    this.setState({selectedMp3Url: url});
  }

  render() {
    const {
      imgUrls,
      selectedImgUrls,
      mp3Urls,
      selectedMp3Url,
    } = this.state;

    const imgs = imgUrls.map(url => (
        <SelectableImage
            key={url}
            url={url}
            isSelected={selectedImgUrls.has(url)}
            onSelect={() => this.selectImgUrl(url)}
            onDeselect={() => this.deselectImgUrl(url)}
        />
    ));

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
        <div className="selector">
          {imgs}
        </div>
        <div className="selector">
          {audios}
        </div>
        <button onClick={this.submit}>Submit</button>
      </div>
    );
  }
}

export class FlashCard {
  constructor({imageUrls, audioUrl}) {
    this.imageUrls = imageUrls;
    this.audioUrl = audioUrl;
  }
}
