import React, { Component } from 'react';
import AudioPicker from './AudioPicker';
import ImagePicker from './ImagePicker';
import './Picker.css';

export default class Picker extends Component {
  static defaultProps = {
    imgUrls: [],
    mp3Urls: [],
  };

  render() {
    return (
      <div>
        <ImagePicker urls={this.props.imgUrls} />
        <hr />
        <AudioPicker urls={this.props.mp3Urls} />
      </div>
    );
  }
}
