import React, { Component } from 'react';
import SelectableAudio from './SelectableAudio';
import SelectableImage from './SelectableImage';
import { query, queryImages } from './shared/query';
import './FlashCardCreator.css';

const defaultState = {
  currentWord: '',
  imgUrls: [],
  currentImagePageNum: 0,
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
    this.queryMoreImages = this.queryMoreImages.bind(this);
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

  async queryMoreImages() {
    const {
      currentImagePageNum,
    } = this.state;
    const nextImagePageNum = currentImagePageNum + 1;
    const imgUrls = await queryImages(this.props.word, nextImagePageNum);
    this.setState({imgUrls, currentImagePageNum: nextImagePageNum});
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
        <button onClick={this.queryMoreImages}>More</button>
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
