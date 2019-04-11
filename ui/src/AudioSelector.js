import React, { Component } from 'react';
import './AudioSelector.css';

// TODO: customize controls: only play button plus clickable area?
export class SelectableAudio extends Component {
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
    const selectedClass = isSelected ? 'selected' : '';
    const classes = `audio-container ${selectedClass}`;
    return (
      <audio controls className={classes} onClick={this.toggleSelect}>
        <source src={url} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    );
  }
}
