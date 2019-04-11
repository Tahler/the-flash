import React, { Component } from 'react';
import Selectable from './Selectable';
import './CheckboxSelector.css';

export default class CheckboxSelector extends Component {
  static defaultProps = {
    /** [T, Component<T>][] */
    contentComponentPairs: [],
    /** Returns T[] */
    onSelectionChange: () => {},
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      contentComponentPairs,
      onSelectionChange,
    } = this.props;

    const imgs = contentComponentPairs.map(([content, component]) => (
      // TODO: put checkboxes next to a box, make component render content in the box, toggling checkbox means toggling content's selection
        <Selectable
            key={url}
            isSelected={selectedImgUrls.has(url)}
        >
          <img
              src={url}
              alt=""
              onClick={() => this.toggleImgSelection(url)}
          />
        </Selectable>
    ));

    const audios = mp3Urls.map(url => (
        <Selectable
            key={url}
            isSelected={selectedMp3Url === url}
        >
          <div onClick={() => this.toggleMp3Selection(url)}>
            <audio controls>
              <source src={url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        </Selectable>
    ));

    return (
      <div>
        <h3>{this.props.word}</h3>
        <div className="selector">
          {imgs}
        </div>
        <div className="selector">
          {audios}
        </div>
        <button onClick={this.submit}>Submit</button>
      </div>
    );
  }
}

export class FlashCard {
  constructor({imageUrls, audioUrl}) {
    this.imageUrls = imageUrls;
    this.audioUrl = audioUrl;
  }
}
