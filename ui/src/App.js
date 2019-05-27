import React, { Component } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import FlashCardManager from './FlashCardManager';
import MultiCardCreator from './MultiCardCreator';
import WordListEntry from './WordListEntry';
import { appendFlashCards } from './shared/storage';
import './App.css';

const page = {
  wordListEntry: 0,
  createFlashCards: 1,
  viewFlashCards: 2,
  menu: 3,
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: page.menu,
      words: [],
    };
    this.receiveWords = this.receiveWords.bind(this);
    this.receiveFlashCards = this.receiveFlashCards.bind(this);
  }

  receiveWords(words) {
    this.setState({
      page: page.createFlashCards,
      words,
    })
  }

  receiveFlashCards(flashCards) {
    appendFlashCards(flashCards);
    this.setState({
      page: page.viewFlashCards,
    })
  }

  render() {
    let content;
    switch (this.state.page) {
      case page.menu:
        content = (
          <div>
            <button onClick={() => this.setState({page: page.wordListEntry})}>
              Create Cards from Word List
            </button>
            <button onClick={() => this.setState({page: page.viewFlashCards})}>
              View Flash Cards
            </button>
          </div>
        );
        break;
      case page.wordListEntry:
        content = <WordListEntry onSubmit={this.receiveWords} />;
        break;
      case page.createFlashCards:
        content = (
            <MultiCardCreator
                words={this.state.words}
                onComplete={this.receiveFlashCards}
            />
        );
        break;
      case page.viewFlashCards:
        content = <FlashCardManager />;
        break;
      default:
        throw new Error('impossible');
    }
    return (
      <div className="App">
        <Navbar bg="dark" variant="dark" expand="lg">
          <Navbar.Brand onClick={() => this.setState({page: page.menu})}>
            Flash Card Creator
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link onClick={() => this.setState({page: page.wordListEntry})}>
                Create
              </Nav.Link>
              <Nav.Link onClick={() => this.setState({page: page.viewFlashCards})}>
                View
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        {content}
      </div>
    );
  }
}
