import React, { Component } from 'react';
import SelectableAudio from './SelectableAudio';
import SelectableImage from './SelectableImage';
import { query, queryImages, queryAudios, queryExamples } from './shared/query';
import './FlashCardCreator.css';
import SelectableText from './SelectableText';

class Page {
  constructor({offset, size}) {
    this.offset = offset;
    this.size = size;
  }

  next() {
    const offset = this.offset + this.size;
    const size = this.size * 2;
    return new Page({offset, size});
  }
}

const defaultState = {
  currentWord: '',

  imgPage: new Page({offset: 0, size: 3}),
  imgUrls: [],
  selectedImgUrls: new Set(),

  mp3Page: new Page({offset: 0, size: 2}),
  mp3Urls: [],
  selectedMp3Url: undefined,

  examplePage: new Page({offset: 0, size: 3}),
  examples: [],
  selectedExamples: new Set(),
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

    this.selectExample = this.selectExample.bind(this);
    this.deselectExample = this.deselectExample.bind(this);
    this.requestMoreExamples = this.requestMoreExamples.bind(this);
  }

  async componentWillReceiveProps({word}) {
    const {currentWord} = this.state;
    if (currentWord !== word) {
      if (word) {
        // TODO: query separately, just use requestMore?
        const {
          imgUrls,
          mp3Urls,
          examples,
        } = await query(word);
        this.setState({
          imgUrls,
          mp3Urls,
          examples,
          currentWord,
        });
      }
    }
  }

  async requestMoreImages() {
    const {
      imgPage,
      imgUrls,
    } = this.state;

    const nextPage = imgPage.next();
    const moreImgUrls = await queryImages(this.props.word, nextPage.offset, nextPage.size);
    this.setState({
      imgPage: nextPage,
      imgUrls: [...imgUrls, ...moreImgUrls],
    });
  }

  async requestMoreAudios() {
    const {
      mp3Page,
      mp3Urls,
    } = this.state;

    const nextPage = mp3Page.next();
    const moreMp3Urls = await queryAudios(this.props.word, nextPage.offset, nextPage.size);
    this.setState({
      mp3Page: nextPage,
      mp3Urls: [...mp3Urls, ...moreMp3Urls],
    });
  }

  async requestMoreExamples() {
    const {
      examplePage,
      examples,
    } = this.state;

    const nextPage = examplePage.next();
    const moreExamples = await queryExamples(this.props.word, nextPage.offset, nextPage.size);
    this.setState({
      examplePage: nextPage,
      examples: [...examples, ...moreExamples],
    });
  }

  submit() {
    this.props.onSubmit(new FlashCard({
      imageUrls: [...this.state.selectedImgUrls],
      audioUrl: this.state.selectedMp3Url,
      examples: [...this.state.examples],
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

  selectExample(example) {
    const selectedExamples = new Set([...this.state.selectedExamples, example]);
    this.setState({selectedExamples});
  }

  deselectExample(example) {
    const selectedExamples = new Set(
        [...this.state.selectedExamples].filter(
            selectedExample => example !== selectedExample));
    this.setState({selectedExamples});
  }

  render() {
    const {
      imgUrls,
      selectedImgUrls,
      mp3Urls,
      selectedMp3Url,
      examples,
      selectedExamples,
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

    const texts = examples.map(example => (
        <SelectableText
            key={example}
            text={example}
            isSelected={selectedExamples.has(example)}
            onSelect={() => this.selectExample(example)}
            onDeselect={() => this.deselectExample(example)}
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
        <div className="selector">
          {texts}
        </div>
        <button onClick={this.requestMoreExamples}>More</button>
        <br />
        <button onClick={this.submit}>Submit</button>
      </div>
    );
  }
}

// TODO: remove this
export class FlashCard {
  constructor({imageUrls, audioUrl, examples}) {
    this.imageUrls = imageUrls;
    this.audioUrl = audioUrl;
    this.examples = examples;
  }
}
