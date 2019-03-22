import flask
from flask import json

from .scrape import forvo, google_images, sentences

app = flask.Flask(__name__)


def json_cors(*args, **kwargs) -> flask.Response:
    response = json.jsonify(*args, **kwargs)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response


@app.route('/audio/forvo/<query>')
def query_audio_forvo(query: str) -> flask.Response:
    # urls = list(forvo.query(query))[:3]
    urls = [
      'http://localhost:5000/static/montaña1.mp3',
      'http://localhost:5000/static/montaña2.mp3',
      'http://localhost:5000/static/montaña3.mp3',
    ]
    return json_cors(urls)


@app.route('/images/google/<query>')
def query_images_google(query: str) -> flask.Response:
    # urls = list(google_images.query(query))[:3]
    urls = [
      'http://localhost:5000/static/montaña1.jpg',
      'http://localhost:5000/static/montaña2.jpg',
      'http://localhost:5000/static/montaña3.jpg',
    ]
    return json_cors(urls)


@app.route('/examples/tatoeba/<query>')
def query_examples_tatoeba(query: str) -> flask.Response:
    # examples = [s for s, _ in sentences.query(query)][:3]
    examples = [
      'Escalo montañas.',
      'Mira esa montaña.',
      'Mirá esa montaña.',
    ]
    return json_cors(examples)
