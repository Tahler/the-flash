import React, { Component } from 'react';
import './Selectable.css';

export default class Selectable extends Component {
  static defaultProps = {
    isSelected: false,
  };

  render() {
    const selected = this.props.isSelected ? 'selected' : '';
    const classes = `selectable ${selected}`;
    return (
      <div className={classes}>
        {this.props.children}
      </div>
    );
  }
}
