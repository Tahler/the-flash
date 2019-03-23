import React, { Component } from 'react';
import './AudioPicker.css';

const NO_OP = () => {};

export default class AudioPicker extends Component {
  static defaultProps = {
    url: '',
    onSelect: NO_OP,
    onDeselect: NO_OP,
  };

  constructor(props) {
    super(props);
    this.state = {
      isSelected: false,
    };
  }

  render() {
    const audios = this.props.urls.map(url => (
        <SelectableAudio
            key={url}
            url={url}
            onSelect={this.props.onSelect}
            onDeselect={this.props.onDeselect}
        />
    ));
    return (
      <div className="audios">
        {audios}
      </div>
    );
  }
}

class SelectableAudio extends Component {
  static defaultProps = {
    url: '',
    onSelect: NO_OP,
    onDeselect: NO_OP,
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
    const selected = this.state.isSelected ? 'selected' : '';
    const classString = `audio-container ${selected}`;
    return (
      <div
          className={classString}
          onClick={this.toggleSelect}
      >
        <audio controls>
          <source src={this.props.url} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }
}
