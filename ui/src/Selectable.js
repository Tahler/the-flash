import React, { Component } from 'react';
import './Selectable.css';

const NO_OP = () => {};

export default class Selectable extends Component {
  static defaultProps = {
    item: undefined,
    onSelect: NO_OP,
    onDeselect: NO_OP,
    children: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      isSelected: false,
    };
    this.toggleSelect = this.toggleSelect.bind(this);
  }

  toggleSelect() {
    console.log('selectring')
    const isSelecting = !this.state.isSelected;
    const event = isSelecting ? this.props.onSelect : this.props.onDeselect;
    event(this.props.item);
    this.setState({isSelected: isSelecting});
  }

  render() {
    const className = `selectable ${this.state.isSelected ? 'selected' : 'unselected'}`
    return (
      <div
          className={className}
          onClick={this.toggleSelect}
      >
        {this.props.children}
      </div>
    );
  }
}
