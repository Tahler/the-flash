import React, { Component } from 'react';

export default class ImagePicker extends Component {
  static defaultProps = {
    urls: [],
  };

  render() {
    const imgs = this.props.urls.map(url =>
        <img src={url} alt="" className="result-img" key={url}></img>)
    return (
      <div>
        {imgs}
      </div>
    );
  }
}
