import base64
import re
from typing import Iterable, Optional
from urllib import parse

import bs4

from . import web

PATTERN = re.compile(r'Play\((.*)\)')


def _get_query_url(query: str) -> str:
    encoded_query = parse.quote(query)
    return 'https://forvo.com/search/{}/es'.format(encoded_query)


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


def _extract_mp3_urls(soup: bs4.BeautifulSoup) -> Iterable[str]:
    play_spans = soup.find('li', 'list-words').find_all('span', 'play')
    for span in play_spans:
        on_click = span['onclick']
        play_id = _extract_play_id(on_click)
        if play_id is not None:
            path_bytes = base64.b64decode(play_id)
            path = path_bytes.decode('utf-8')
            url = _get_mp3_url(path)
            yield url


def query(query: str) -> Iterable[bytes]:
    """Returns a generator of raw MP3 data for query from Forvo."""
    url = _get_query_url(query)
    soup = web.get_html(url)
    urls = _extract_mp3_urls(soup)
    for url in urls:
        mp3 = web.get_binary_content(url)
        yield mp3
