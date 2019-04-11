import React, { Component } from 'react';
import SelectableImage from './SelectableImage';

export default class ImageSelector extends Component {
  static defaultProps = {
    imgUrls: [],
    onSelectionChange: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedImgUrls: new Set(),
    };

    this.selectImgUrl = this.selectImgUrl.bind(this);
    this.deselectImgUrl = this.deselectImgUrl.bind(this);
  }

  selectImgUrl(url) {
    const selectedImgUrls = new Set([...this.state.selectedImgUrls, url]);
    this.setState({selectedImgUrls});
    this.props.onSelectionChange(selectedImgUrls);
  }

  deselectImgUrl(url) {
    // TODO: find a better way to delete immutably.
    const selectedImgUrls = new Set(
        [...this.state.selectedImgUrls].filter(
            selectedUrl => url !== selectedUrl));
    this.setState({selectedImgUrls});
    this.props.onSelectionChange(selectedImgUrls);
  }

  render() {
    console.log(this.state.selectedImgUrls)
    const imgs = this.props.imgUrls.map(url => (
        <SelectableImage
            key={url}
            url={url}
            isSelected={this.state.selectedImgUrls.has(url)}
            onSelect={() => this.selectImgUrl(url)}
            onDeselect={() => this.deselectImgUrl(url)}
        />
    ));

    return (
      <div className="selector">
        {imgs}
      </div>
    );
  }
}
