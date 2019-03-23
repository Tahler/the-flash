import React, { Component } from 'react';
import AudioSelector from './AudioSelector';
import ImageSelector from './ImageSelector';
import './Selector.css';

const NO_OP = () => {};

export default class Selector extends Component {
  static defaultProps = {
    imgUrls: [],
    mp3Urls: [],
    onSubmit: NO_OP,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedImgUrls: new Set(),
      selectedMp3Urls: new Set(),
    };

    this.submit = this.submit.bind(this);
    this.addSelectedImgUrl = this.addSelectedImgUrl.bind(this);
    this.deleteSelectedImgUrl = this.deleteSelectedImgUrl.bind(this);
    this.addSelectedMp3Url = this.addSelectedMp3Url.bind(this);
    this.deleteSelectedMp3Url = this.deleteSelectedMp3Url.bind(this);
  }

  submit() {
    this.props.onSubmit(new FlashCard({
      imageUrls: this.state.selectedImgUrls,
      audioUrls: this.state.selectedMp3Urls,
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

  addSelectedMp3Url(url) {
    this.state.selectedMp3Urls.add(url);
    this.setState({selectedMp3Urls: this.state.selectedMp3Urls});
  }

  deleteSelectedMp3Url(url) {
    this.state.selectedMp3Urls.delete(url);
    this.setState({selectedMp3Urls: this.state.selectedMp3Urls});
  }

  render() {
    return (
      <div>
        <ImageSelector
            urls={this.props.imgUrls}
            onSelect={this.addSelectedImgUrl}
            onDeselect={this.deleteSelectedImgUrl}
        />
        <hr />
        <AudioSelector
            urls={this.props.mp3Urls}
            onSelect={this.addSelectedMp3Url}
            onDeselect={this.deleteSelectedMp3Url}
        />
        <button onClick={this.submit}>Submit</button>
      </div>
    );
  }
}

class FlashCard {
  constructor({imageUrls, audioUrls}) {
    this.imageUrls = imageUrls;
    this.audioUrls = audioUrls;
  }
}
