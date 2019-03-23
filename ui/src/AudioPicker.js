import React, { Component } from 'react';

export default class AudioPicker extends Component {
  static defaultProps = {
    urls: [],
  };

  render() {
    const audios = this.props.urls.map(url => (
      <audio key={url} controls>
        <source src={url} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    ));
    return (
      <div>
        {audios}
      </div>
    );
  }
}
