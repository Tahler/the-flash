import React, { Component } from 'react';
import './AudioSelector.css';

export default class AudioSelector extends Component {
  static defaultProps = {
    url: '',
    onSelectionChange: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedUrl: undefined,
    };
  }

  onClick(url) {
    const selectedUrl = this.state.selectedUrl === url ? undefined : url;
    this.props.onSelectionChange(selectedUrl);
    this.setState({selectedUrl});
  }

  render() {
    const audios = this.props.urls.map(url => (
        <SelectableAudio
            key={url}
            url={url}
            isSelected={this.state.selectedUrl === url}
            onClick={() => this.onClick(url)}
        />
    ));
    return (
      <div className="audios">
        {audios}
      </div>
    );
  }
}

// TODO: customize controls: only play button plus clickable area?
class SelectableAudio extends Component {
  static defaultProps = {
    url: '',
    isSelected: false,
  };

  render() {
    const {isSelected, url, ...otherProps} = this.props;
    const selectedClass = isSelected ? 'selected' : '';
    const classes = `audio-container ${selectedClass}`;
    return (
      <audio controls className={classes} {...otherProps}>
        <source src={url} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    );
  }
}
