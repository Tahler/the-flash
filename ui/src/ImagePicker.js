import React, { Component } from 'react';
import './ImagePicker.css';

export default class ImagePicker extends Component {
  static defaultProps = {
    urls: [],
  };

  render() {
    const imgs = this.props.urls.map(url =>
        <SelectableImage src={url} alt="" key={url}></SelectableImage>)
    return (
      <div className="imgs">
        {imgs}
      </div>
    );
  }
}

class SelectableImage extends Component {
  static defaultProps = {
    src: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      isSelected: false,
    };
  }

  render() {
    const {isSelected} = this.state;
    return (
      <img
          src={this.props.src}
          alt=""
          onClick={() => this.setState({isSelected: !isSelected})}
          className={isSelected ? 'selected' : ''}>
      </img>
    );
  }
}
