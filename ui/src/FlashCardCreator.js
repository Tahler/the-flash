import React, { Component } from 'react';
import SelectableAudio from './SelectableAudio';
import SelectableImage from './SelectableImage';
import { query, queryImages } from './shared/query';
import './FlashCardCreator.css';

const defaultState = {
  currentWord: '',
  imgUrls: [],
  currentImgPageOffset: 0,
  currentImgPageSize: 3,
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
    this.requestMoreImages = this.requestMoreImages.bind(this);
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

  async requestMoreImages() {
    const {
      currentImgPageOffset,
      currentImgPageSize,
      imgUrls,
    } = this.state;

    const nextOffset = currentImgPageOffset + currentImgPageSize;
    const nextSize = currentImgPageSize * 2;
    const moreImgUrls = await queryImages(this.props.word, nextOffset, nextSize);
    this.setState({
      imgUrls: [...imgUrls, ...moreImgUrls],
      currentImgPageOffset: nextOffset,
      currentImgPageSize: nextSize,
    });
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
        <button onClick={this.requestMoreImages}>More</button>
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
