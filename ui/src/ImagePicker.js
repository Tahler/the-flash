import React, { Component } from 'react';
import './ImagePicker.css';

export default class ImagePicker extends Component {
  static defaultProps = {
    urls: [],
  };

  render() {
    const imgs = this.props.urls.map(url =>
        <img src={url} alt="" key={url}></img>)
    return (
      <div className="imgs">
        {imgs}
      </div>
    );
  }
}
