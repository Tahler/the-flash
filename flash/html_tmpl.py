import logging
import os
from typing import Any, Dict, List, Tuple

import jinja2

HTML_TEMPLATE = '''<!doctype html>
<html lang=en>
    <head>
        <meta charset=utf-8>
        <title>Anki Content</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous">
    </head>
    <body class="container-fluid">
        {% for card in cards %}
        <h2 class="col">{{ card.word }}</h2>

        <div class="row">
            {% for path in card.image_paths %}
            <div class="col">
                <img class="img-fluid" src="../{{ path }}" />
            </div>
            {%- endfor %}
        </div>

        <audio controls>
            <source src="../{{ card.mp3_path }}" type="audio/mpeg">
        </audio>

        {% for sentence in card.sentences %}
        <p>{{ sentence }}</p>
        {%- endfor %}

        {% for text, link in card.links %}
        <p><a href="{{ link }}">{{ text }}</a></p>
        {%- endfor %}

        <hr />
        {%- endfor %}
    </body>
</html>
'''


class Card:
    def __init__(self, word: str, links: List[Tuple[str, str]],
                 sentences: List[str], image_paths: List[str],
                 mp3_path: str) -> None:
        self.word = word
        self.links = links
        self.sentences = sentences
        self.image_paths = image_paths
        self.mp3_path = mp3_path


def get_card_args(card: Card) -> Dict[str, Any]:
    return {
        'word': card.word,
        'image_paths': card.image_paths,
        'links': card.links,
        'mp3_path': card.mp3_path,
        'sentences': card.sentences,
    }


def render(cards: List[Card]) -> str:
    logging.info('rendering HTML document')
    template = jinja2.Template(HTML_TEMPLATE)
    card_args = [get_card_args(card) for card in cards]
    args = {'cards': card_args}
    html_str = template.render(args)
    return html_str
