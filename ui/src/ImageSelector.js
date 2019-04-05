import React, { Component } from 'react';
import './ImageSelector.css';

export default class ImageSelector extends Component {
  static defaultProps = {
    urls: [],
    onSelect: () => {},
    onDeselect: () => {},
  };

  render() {
    const imgs = this.props.urls.map(url =>
        <SelectableImage
            key={url}
            url={url}
            onSelect={this.props.onSelect}
            onDeselect={this.props.onDeselect}
        />)
    return (
      <div className="imgs">
        {imgs}
      </div>
    );
  }
}

class SelectableImage extends Component {
  static defaultProps = {
    url: '',
    onSelect: () => {},
    onDeselect: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      isSelected: false,
    };
    this.toggleSelect = this.toggleSelect.bind(this);
  }

  toggleSelect() {
    const isSelecting = !this.state.isSelected;
    const event = isSelecting ? this.props.onSelect : this.props.onDeselect;
    event(this.props.url);
    this.setState({isSelected: isSelecting});
  }

  render() {
    return (
      <img
          src={this.props.url}
          alt=""
          onClick={this.toggleSelect}
          className={this.state.isSelected ? 'selected' : ''}
      >
      </img>
    );
  }
}
