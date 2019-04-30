import React, { Component } from 'react';

export default class SelectableText extends Component {
  static defaultProps = {
    text: '',
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
      text,
    } = this.props;
    return (
      <div
          className={`selectable ${isSelected ? 'selected' : ''}`}
          onClick={this.toggleSelect}
      >
        <input type="checkbox" checked={isSelected} />
        <p>{text}</p>
      </div>
    );
  }
}
