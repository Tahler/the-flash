import os
from typing import Any, Dict, Iterable, Tuple

import jinja2

HTML_TEMPLATE = '''
<!doctype html>
<html lang=en>
    <head>
        <meta charset=utf-8>
        <title>Anki Content</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous">
    </head>
    <body class="container-fluid">
        {% for word in words %}
        <h2 class="col">{{ word.word }}</h2>

        <div class="row">
            {% for path in word.image_paths %}
            <div class="col">
                <img class="img-fluid" src="{{ path }}" />
            </div>
            {%- endfor %}
        </div>

        {% for path in word.mp3_paths %}
        <audio controls>
            <source src="{{ path }}" type="audio/mpeg">
        </audio>
        {%- endfor %}

        {% for sentence in word.sentences %}
        <p>{{ sentence }}</p>
        {%- endfor %}

        {% for text, link in word.links %}
        <p><a href="{{ link }}">{{ text }}</a></p>
        {%- endfor %}

        {%- endfor %}
    </body>
</html>
'''


class Word:
    def __init__(self, word: str, links: Iterable[Tuple[str, str]],
                 sentences: Iterable[str], image_paths: Iterable[os.PathLike],
                 mp3_paths: Iterable[os.PathLike]):
        self.word = word
        self.links = links
        self.sentences = sentences
        self.image_paths = image_paths
        self.mp3_paths = mp3_paths


def get_word_args(word: Word) -> Dict[str, Any]:
    return {
        'word': word.word,
        'image_paths': word.image_paths,
        'links': word.links,
        'mp3_paths': word.mp3_paths,
        'sentences': word.sentences,
    }


def render(words: Iterable[Word]) -> str:
    template = jinja2.Template(HTML_TEMPLATE)
    word_args = (get_word_args(word) for word in words)
    args = {'words': word_args}
    html_str = template.render(args)
    return html_str
