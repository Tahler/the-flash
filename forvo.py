import base64
import bs4
import re
import requests
from typing import Iterable, Optional

import soups

PATTERN = re.compile(r'Play\((.*)\)')


def _get_query_url(query: str) -> str:
    encoded_query = '%20'.join(query.split())
    return 'https://forvo.com/search/{}/es'.format(encoded_query)


def _extract_play_id(on_click_play_call: str) -> Optional[str]:
    """Extracts the fifth argument to the Play() call."""
    match = PATTERN.search(on_click_play_call)
    if match:
        args_str = match.group(1)
        args = args_str.split(',')
        play_id = args[4]
    else:
        play_id = None
    return play_id


def _get_mp3_url(path: str) -> str:
    return 'https://audio00.forvo.com/audios/mp3/{}'.format(path)


def _extract_mp3_urls(soup: bs4.BeautifulSoup) -> Iterable[str]:
    play_spans = soup.find('li', 'list-words').find_all('span', 'play')
    on_clicks = (span['onclick'] for span in play_spans)
    play_ids = (_extract_play_id(on_click) for on_click in on_clicks)
    byte_str_paths = (base64.b64decode(play_id) for play_id in play_ids
             if play_id is not None)
    paths = (byte_str.decode('utf-8') for byte_str in byte_str_paths)
    urls = (_get_mp3_url(path) for path in paths)
    return urls


def _get_mp3(url: str) -> bytes:
    response = requests.get(url)
    return response.content


def query(query: str) -> Iterable[bytes]:
    """Returns a generator of raw MP3 data for query from Forvo."""
    url = _get_query_url(query)
    soup = soups.get(url)
    urls = _extract_mp3_urls(soup)
    mp3s = (_get_mp3(url) for url in urls)
    return mp3s
