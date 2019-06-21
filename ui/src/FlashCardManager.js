import React, { Component } from 'react';
import JSZip from 'jszip';
import { loadFlashCards } from './shared/storage';

export default class FlashCardManager extends Component {
  constructor(props) {
    super(props);

    this.state = {
      flashCards: loadFlashCards(),
    };

    this.download = this.download.bind(this);
  }

  extractExtension(url) {
    const splits = url.split('.');
    return splits[splits.length - 1];
  }

  async download() {
    const blobbedCards = await this.state.flashCards.map(async card => {
      const namedImageBlobs = await card.imageUrls.map(async (url, i) => {
        const ext = this.extractExtension(url);
        // TODO: parallelize these fetches
        const blob = await fetch(url, { mode: 'no-cors' }).then(r => r.blob());
        // TODO: enforce unique words
        return [`${card.word}-${i}.${ext}`, blob];
      });
      // TODO: this is returning promises
      console.log(namedImageBlobs)
      const audioExt = this.extractExtension(card.audioUrl);
      const audioBlob = await fetch(card.audioUrl, { mode: 'no-cors' }).then(r => r.blob());
      const namedAudioBlob = [`${card.word}.${audioExt}`, audioBlob];
      return {
        word: card.word,
        examples: card.examples,
        namedImageBlobs,
        namedAudioBlob,
      };
    });

    console.log(blobbedCards)

    const zip = new JSZip();
    for (const card of blobbedCards) {
      for (const [path, blob] of card.namedImageBlobs) {
        zip.file(path, blob);
      }
      const [audioPath, audioBlob] = card.namedAudioBlob;
      zip.file(audioPath, audioBlob);
    }

    const headerRow = ['Word', 'Picture', 'Gender, Personal Connection, Extra Info (Back side)', 'Pronunciation (Recording and/or IPA)', 'Test Spelling? (y = yes, blank = no)'];
    const cardRows = blobbedCards.map(card => {
      const imgs = card.namedImageBlobs.map(([path, b]) => `<img src="${path}">`).join('');
      const [audioPath, b] = card.namedAudioBlob;
      const sound = `[sound:${audioPath}]`;
      const examples = card.examples.join(';');
      return [card.word, imgs, examples, sound, ''].map(f => `"${f}"`);
    });
    const rows = [headerRow, cardRows];
    const lines = rows.map(row => row.join(','));
    const content = lines.join('\n');
    zip.file('flash_cards.csv', content);

    const zipBlob = await zip.generateAsync();
    downloadContent('content.zip', zipBlob);
  }

  render() {
    const cards = this.state.flashCards.map(card => (
        <div key={card.word}>
          <p>{card.word}</p>
          <div>
            {card.imageUrls.map(url => <img key={url} src={url} alt="" />)}
          </div>
          <div>
            <audio controls>
              <source src={card.audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
    ));
    return (
      <div>
        <button onClick={this.download}>Download</button>
        <div>
          {cards}
        </div>
      </div>
    );
  }
}

function downloadContent(fileName, content) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
  element.setAttribute('download', fileName);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
