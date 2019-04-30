import itertools
from typing import Iterable

import flask
from flask import json, request

from .scrape import forvo, google_images, sentences

app = flask.Flask(__name__)

DEFAULT_PAGE_SIZE = 10


def json_cors(*args, **kwargs) -> flask.Response:
    response = json.jsonify(*args, **kwargs)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response


def get_query_param_int_or(key, default) -> int:
    s = request.args.get(key, default)
    try:
        x = int(s)
    except:
        x = default
    return x


def paged_json_cors(iterable: Iterable[any]) -> flask.Response:
    offset = get_query_param_int_or('offset', 0)
    size = get_query_param_int_or('size', DEFAULT_PAGE_SIZE)
    page = list(itertools.islice(iterable, offset, offset + size))
    return json_cors(page)


@app.route('/audio/forvo/<query>')
def query_audio_forvo(query: str) -> flask.Response:
    urls = list(forvo.query(query))
    return paged_json_cors(urls)


@app.route('/images/google/<query>')
def query_images_google(query: str) -> flask.Response:
    urls = list(google_images.query(query))
    return paged_json_cors(urls)


@app.route('/examples/tatoeba/<query>')
def query_examples_tatoeba(query: str) -> flask.Response:
    examples = [s for s, _ in sentences.query(query)]
    return paged_json_cors(examples)
