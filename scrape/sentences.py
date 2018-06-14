from typing import List, Iterable, Tuple
from urllib import parse

import bs4
import requests

from . import web

_QUERY_URL_FMT = (
    'https://tatoeba.org/eng/sentences/search?from=spa&to=eng&query={}')


def _get_query_url(query: str) -> str:
    encoded_query = parse.quote(query)
    return _QUERY_URL_FMT.format(encoded_query)


def _extract_sentence(div: bs4.BeautifulSoup) -> str:
    sentence_div = div.find('div', 'sentence')
    text_div = sentence_div.find('div', 'text')
    text = text_div.get_text().strip()
    return text


def _extract_translations(div: bs4.BeautifulSoup) -> Iterable[str]:
    translations_divs = div.find_all('div', 'translation')
    for div in translations_divs:
        text_div = div.find('div', 'text')
        translation = text_div.get_text().strip()
        yield translation


def _extract_sentences_with_translations(
        soup: bs4.BeautifulSoup) -> Iterable[Tuple[str, Iterable[str]]]:
    divs = soup.find_all('div', 'sentence-and-translations')
    for div in divs:
        sentence = _extract_sentence(div)
        translations = _extract_translations(sentence)
        yield sentence, translations


def query(query: str) -> Iterable[Tuple[str, Iterable[str]]]:
    """Returns a generator of (sentence, translations)."""
    url = _get_query_url(query)
    soup = web.get_html(url)
    return _extract_sentences_with_translations(soup)
