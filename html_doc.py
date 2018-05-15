import os
from typing import Any, Dict, Iterable, Tuple

import jinja2

HTML_TEMPLATE = '''
<!doctype html>
<html lang=en>
    <head>
        <meta charset=utf-8>
        <title>Anki Content</title>
    </head>
    <body>
        {% for word in words %}
        <h2>{{ word.word }}</h2>

        {% for path in word.image_paths %}
        <img src="{{ path }}" />
        {%- endfor %}

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
