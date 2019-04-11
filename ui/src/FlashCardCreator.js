import React, { Component } from 'react';
import Selectable from './Selectable';
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
    this.toggleImgSelection = this.toggleImgSelection.bind(this);
    this.toggleMp3Selection = this.toggleMp3Selection.bind(this);
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

  toggleImgSelection(url) {
    const handle = this.state.selectedImgUrls.has(url) ?
        this.deselectImgUrl :
        this.selectImgUrl;
    handle(url);
  }

  toggleMp3Selection(url) {
    const selectedMp3Url = this.state.selectedMp3Url === url ? undefined : url;
    this.setState({selectedMp3Url});
  }

  render() {
    const {
      imgUrls,
      selectedImgUrls,
      mp3Urls,
      selectedMp3Url,
    } = this.state;

    const imgs = imgUrls.map(url => (
        <Selectable
            key={url}
            isSelected={selectedImgUrls.has(url)}
        >
          <img
              src={url}
              alt=""
              onClick={() => this.toggleImgSelection(url)}
          />
        </Selectable>
    ));

    const audios = mp3Urls.map(url => (
        <Selectable
            key={url}
            isSelected={selectedMp3Url === url}
        >
          <div onClick={() => this.toggleMp3Selection(url)}>
            <audio controls>
              <source src={url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        </Selectable>
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
