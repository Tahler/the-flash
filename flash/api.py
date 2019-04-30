# TODO: these page vars should be query params
import itertools
from typing import Iterable

import flask
from flask import json

from .scrape import forvo, google_images, sentences

app = flask.Flask(__name__)


def json_cors(*args, **kwargs) -> flask.Response:
    response = json.jsonify(*args, **kwargs)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response


def paged_json_cors(
      iterable: Iterable[any], offset: int, size: int) -> flask.Response:
    page = list(itertools.islice(iterable, offset, offset + size))
    return json_cors(page)


@app.route('/audio/forvo/<query>/<int:offset>/<int:size>')
def query_audio_forvo(query: str, offset: int, size: int) -> flask.Response:
    # urls = list(forvo.query(query))
    urls = [
      'http://localhost:5000/static/montaña1.mp3',
      'http://localhost:5000/static/montaña2.mp3',
      'http://localhost:5000/static/montaña3.mp3',
      'http://localhost:5000/static/montaña4.mp3',
      'http://localhost:5000/static/montaña5.mp3',
    ]
    return paged_json_cors(urls, offset, size)


@app.route('/images/google/<query>/<int:offset>/<int:size>')
def query_images_google(query: str, offset: int, size: int) -> flask.Response:
    # urls = list(google_images.query(query))
    urls = [
      'http://localhost:5000/static/montaña1.jpg',
      'http://localhost:5000/static/montaña2.jpg',
      'http://localhost:5000/static/montaña3.jpg',
      'http://localhost:5000/static/montaña4.jpg',
      'http://localhost:5000/static/montaña5.jpg',
      'http://localhost:5000/static/montaña6.jpg',
    ]
    return paged_json_cors(urls, offset, size)


@app.route('/examples/tatoeba/<query>/<int:offset>/<int:size>')
def query_examples_tatoeba(
        query: str, offset: int, size: int) -> flask.Response:
    # examples = [s for s, _ in sentences.query(query)]
    examples = [
      'Escalo montañas.',
      'Mira esa montaña.',
      'Mirá esa montaña.',
      'Escalo montañas.',
      'Mira esa montaña.',
      'Mirá esa montaña.',
    ]
    return paged_json_cors(examples, offset, size)
