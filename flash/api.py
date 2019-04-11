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
      iterable: Iterable[any], page_size: int, page_num: int) -> flask.Response:
    start = page_num * page_size
    end = start + page_size
    page = list(itertools.islice(iterable, start, end))
    return json_cors(page)


@app.route('/audio/forvo/<query>/<int:page_size>/<int:page_num>')
def query_audio_forvo(
        query: str, page_size: int, page_num: int) -> flask.Response:
    # urls = list(forvo.query(query))
    urls = [
      'http://localhost:5000/static/montaña1.mp3',
      'http://localhost:5000/static/montaña2.mp3',
      'http://localhost:5000/static/montaña3.mp3',
      'http://localhost:5000/static/montaña4.mp3',
      'http://localhost:5000/static/montaña5.mp3',
    ]
    return paged_json_cors(urls, page_size, page_num)


@app.route('/images/google/<query>/<int:page_size>/<int:page_num>')
def query_images_google(
        query: str, page_size: int, page_num: int) -> flask.Response:
    # urls = list(google_images.query(query))
    urls = [
      'http://localhost:5000/static/montaña1.jpg',
      'http://localhost:5000/static/montaña2.jpg',
      'http://localhost:5000/static/montaña3.jpg',
      'http://localhost:5000/static/montaña4.jpg',
      'http://localhost:5000/static/montaña5.jpg',
      'http://localhost:5000/static/montaña6.jpg',
    ]
    return paged_json_cors(urls, page_size, page_num)


@app.route('/examples/tatoeba/<query>/<int:page_size>/<int:page_num>')
def query_examples_tatoeba(
        query: str, page_size: int, page_num: int) -> flask.Response:
    # examples = [s for s, _ in sentences.query(query)]
    examples = [
      'Escalo montañas.',
      'Mira esa montaña.',
      'Mirá esa montaña.',
    ]
    return paged_json_cors(examples, page_size, page_num)
