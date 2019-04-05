import React, { Component } from 'react';

export default class WordListEntry extends Component {
  static defaultProps = {
    onSubmit: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      text: 'montaña\ncasa\ncabrero',
    };
    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  handleChange(event) {
    this.setState({text: event.target.value});
  }

  submit() {
    const lines = this.state.text.split('\n');
    const trimmedLines = lines.map(s => s.trim());
    this.props.onSubmit(trimmedLines);
  }

  render() {
    return (
      <div>
        <textarea onChange={this.handleChange} defaultValue={this.state.text}></textarea>
        <button disabled={!this.state.text} onClick={this.submit}>Submit</button>
      </div>
    );
  }
}
