import bs4
import requests
from typing import List, Iterable, Tuple

import soups

_QUERY_URL_FMT = (
    'https://tatoeba.org/eng/sentences/search?from=spa&to=eng&query={}')


def _get_query_url(query: str) -> str:
    encoded_query = '+'.join(query.split())
    return _QUERY_URL_FMT.format(encoded_query)


def _extract_sentence(div: bs4.BeautifulSoup) -> str:
    sentence_div = div.find('div', 'sentence')
    text_div = sentence_div.find('div', 'text')
    text = text_div.get_text().strip()
    return text


def _extract_translations(div: bs4.BeautifulSoup) -> List[str]:
    translations_divs = div.find_all('div', 'translation')
    text_divs = [div.find('div', 'text') for div in translations_divs]
    translations = [div.get_text().strip() for div in text_divs]
    return translations


def _extract_sentences_with_translations(
        soup: bs4.BeautifulSoup) -> Iterable[Tuple[str, List[str]]]:
    cards = soup.find_all('div', 'sentence-and-translations')
    sentences = (_extract_sentence(div) for div in cards)
    translations_lists = (_extract_translations(div) for div in cards)
    sentences_with_translations = zip(sentences, translations_lists)
    return sentences_with_translations


def query(query: str) -> Iterable[Tuple[str, List[str]]]:
    """Returns a generator of (sentence, translations)."""
    url = _get_query_url(query)
    soup = soups.get(url)
    return _extract_sentences_with_translations(soup)
