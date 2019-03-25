import React, { Component } from 'react';
import Selectable from './Selectable';
import './Selector.css';

const NO_OP = () => {};

// TODO: selection style? one vs multi? use radio/checkbox
export default class Selector extends Component {
  static defaultProps = {
    children: [],
    mapItem: () => undefined,
    onSelect: NO_OP,
    onDeselect: NO_OP,
  };

  render() {
    const {
      children,
      mapItem,
      onSelect,
      onDeselect,
    } = this.props;
    const selectables = children.map(child => {
      const item = mapItem(child);
      return (
        <Selectable
            key={item}
            item={item}
            onSelect={onSelect}
            onDeselect={onDeselect}
        >
          {child}
        </Selectable>
      );
    });
    return (
      <div className="selector">
        {selectables}
      </div>
    );
  }
}
