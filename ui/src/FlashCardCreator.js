import React, { Component } from 'react';
import SelectableAudio from './SelectableAudio';
import SelectableImage from './SelectableImage';
import { query, queryImages, queryAudios } from './shared/query';
import './FlashCardCreator.css';

const defaultState = {
  currentWord: '',

  currentImgPageOffset: 0,
  currentImgPageSize: 3,
  imgUrls: [],
  selectedImgUrls: new Set(),

  currentMp3PageOffset: 0,
  currentMp3PageSize: 2,
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
    this.requestMoreImages = this.requestMoreImages.bind(this);

    this.setSelectedMp3Url = this.setSelectedMp3Url.bind(this);
    this.requestMoreAudios = this.requestMoreAudios.bind(this);
  }

  async componentWillReceiveProps({word}) {
    const {currentWord} = this.state;
    if (currentWord !== word) {
      if (word) {
        // TODO: query separately, just use requestMore?
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

  async requestMoreAudios() {
    const {
      currentMp3PageOffset,
      currentMp3PageSize,
      mp3Urls,
    } = this.state;

    const nextOffset = currentMp3PageOffset + currentMp3PageSize;
    const nextSize = currentMp3PageSize * 2;
    const moreMp3Urls = await queryAudios(this.props.word, nextOffset, nextSize);
    this.setState({
      mp3Urls: [...mp3Urls, ...moreMp3Urls],
      currentMp3PageOffset: nextOffset,
      currentMp3PageSize: nextSize,
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
        <button onClick={this.requestMoreAudios}>More</button>
        <br />
        <button onClick={this.submit}>Submit</button>
      </div>
    );
  }
}

// TODO: remove this
export class FlashCard {
  constructor({imageUrls, audioUrl}) {
    this.imageUrls = imageUrls;
    this.audioUrl = audioUrl;
  }
}
