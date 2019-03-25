import React, { Component } from 'react';
import Selector from './Selector';
import './ImageSelector.css';

const NO_OP = () => {};

export default class ImageSelector extends Component {
  static defaultProps = {
    urls: [],
    onSelect: NO_OP,
    onDeselect: NO_OP,
  };

  render() {
    const imgs = this.props.urls.map(url =>
        <img key={url} src={url} alt="" />);
    return (
      <div className="imgs">
        <Selector
            mapItem={(img) => img.props.src}
            onSelect={this.props.onSelect}
            onDeselect={this.props.onDeselect}
        >
          {imgs}
        </Selector>
      </div>
    );
  }
}
