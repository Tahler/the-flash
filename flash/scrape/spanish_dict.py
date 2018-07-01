import base64
import enum
import re
from typing import Iterable, Optional
from urllib import parse

import bs4
import requests

from . import web

PATTERN = re.compile(r'Play\((.*)\)')


def _get_query_url(query: str) -> str:
    encoded_query = parse.quote(query)
    return 'http://www.spanishdict.com/translate/{}'.format(encoded_query)


def _extract_play_id(on_click_play_call: str) -> Optional[str]:
    """Extracts the fifth argument to the Play() call."""
    match = PATTERN.search(on_click_play_call)
    if match:
        args_str = match.group(1)
        args = args_str.split(',')
        play_id = args[4]  # type: Optional[str]
    else:
        play_id = None
    return play_id


def _get_mp3_url(path: str) -> str:
    return 'https://audio00.forvo.com/audios/mp3/{}'.format(path)


class PartOfSpeech(enum.Enum):
    MASCULINE_NOUN = 0
    FEMININE_NOUN = 1
    OTHER = 2


class Info:
    def __init__(self, url: str, word: str, pronunciation: bytes,
                 examples: Iterable[str]) -> None:
        self.url = url
        self.word = word
        self.pronunciation = pronunciation
        self.examples = examples


def _extract_part_of_speech(text: str) -> PartOfSpeech:
    if 'noun' in text:
        if 'masculine' in text:
            part_of_speech = PartOfSpeech.MASCULINE_NOUN
        elif 'feminine' in text:
            part_of_speech = PartOfSpeech.FEMININE_NOUN
        else:
            part_of_speech = PartOfSpeech.OTHER
    else:
        part_of_speech = PartOfSpeech.OTHER
    return part_of_speech


def _attach_gender(word: str, part_of_speech: PartOfSpeech) -> str:
    if part_of_speech == PartOfSpeech.MASCULINE_NOUN:
        gendered_word = 'el {}'.format(word)
    elif part_of_speech == PartOfSpeech.FEMININE_NOUN:
        gendered_word = 'la {}'.format(word)
    else:
        gendered_word = word
    return gendered_word


def query(query: str) -> Info:
    """Returns info from spanishdict.com for the query."""
    url = _get_query_url(query)

    soup = web.get_html(url)
    tab_div = soup.find('div', id='translate-en')
    if tab_div is None:
        tab_div = soup
    card = tab_div.find('div', 'card')

    pronunciation_url = card.find('div', 'source').find(
        'span', 'media-links').find('a')['href']
    pronunciation = web.get_binary_content(pronunciation_url)

    part_of_speech_div = card.find('a',
                                   'dictionary-neodict-first-part-of-speech')
    if part_of_speech_div is None:
        word = query
    else:
        part_of_speech = _extract_part_of_speech(part_of_speech_div.get_text())
        word = _attach_gender(query, part_of_speech)

    example_divs = card.find_all('div', 'dictionary-neodict-example')
    examples = [div.find('span').get_text().strip() for div in example_divs]

    return Info(
        url=url, word=word, pronunciation=pronunciation, examples=examples)
