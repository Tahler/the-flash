import React, { Component } from 'react';
import AudioPicker from './AudioPicker';
import ImagePicker from './ImagePicker';
import './Picker.css';

export default class Picker extends Component {
  static defaultProps = {
    imgUrls: [],
    mp3Urls: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedImgUrls: new Set(),
    };

    this.addSelectedImgUrl = this.addSelectedImgUrl.bind(this);
    this.deleteSelectedImgUrl = this.deleteSelectedImgUrl.bind(this);
  }

  addSelectedImgUrl(url) {
    this.state.selectedImgUrls.add(url);
    this.setState({selectedImgUrls: this.state.selectedImgUrls});
  }

  deleteSelectedImgUrl(url) {
    this.state.selectedImgUrls.delete(url);
    this.setState({selectedImgUrls: this.state.selectedImgUrls});
  }

  render() {
    return (
      <div>
        <ImagePicker
            urls={this.props.imgUrls}
            onSelect={this.addSelectedImgUrl}
            onDeselect={this.deleteSelectedImgUrl}
        />
        <hr />
        <AudioPicker urls={this.props.mp3Urls} />
      </div>
    );
  }
}
