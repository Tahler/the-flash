import React, { Component } from 'react';
import './SelectableImage.css';

export default class SelectableImage extends Component {
  static defaultProps = {
    url: '',
    isSelected: false,
    onSelect: () => {},
    onDeselect: () => {},
  };

  constructor(props) {
    super(props);
    this.toggleSelect = this.toggleSelect.bind(this);
  }

  toggleSelect() {
    const event = this.props.isSelected ?
        this.props.onDeselect :
        this.props.onSelect;
    event();
  }

  render() {
    const {
      isSelected,
      url,
    } = this.props;
    return (
      <div
          className={`selectable-img ${isSelected ? 'selected' : ''}`}
          onClick={() => this.toggleSelect(this.props.url)}
      >
        <input type="checkbox" checked={isSelected} />
        <img src={url} alt="" />
      </div>
    );
  }
}
