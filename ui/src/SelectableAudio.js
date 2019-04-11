import React, { Component } from 'react';
import './SelectableAudio.css';

// TODO: customize controls: only play button plus clickable area?
export default class SelectableAudio extends Component {
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
          className={`selectable ${isSelected ? 'selected' : ''}`}
          onClick={this.toggleSelect}
      >
        <input
            type="radio"
            onChange={this.toggleSelect}
            checked={isSelected}
        />
        <audio controls>
          <source src={url} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }
}
