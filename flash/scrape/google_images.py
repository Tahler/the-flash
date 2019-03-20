import json
from typing import List, Iterable, Tuple
from urllib import parse

import bs4

from . import web


def _get_query_url(query: str) -> str:
    encoded_query = parse.quote(query)
    return 'https://www.google.com.mx/search?q={}&tbm=isch'.format(
        encoded_query)


def _extract_image_urls(soup: bs4.BeautifulSoup) -> Iterable[Tuple[str, str]]:
    metadata_elements = soup.find_all('div', 'rg_meta')
    for element in metadata_elements:
        js = json.loads(element.text)
        img_url = js['ou']
        img_extension = js['ity']
        if not img_extension:
            img_extension = 'jpg'
        yield img_url, img_extension


def query(query: str) -> Iterable[str]:
    """Returns a generator of (raw_image, extension) for the query."""
    url = _get_query_url(query)
    soup = web.get_html(url)
    url_ext_tuples = _extract_image_urls(soup)
    for (url, _) in url_ext_tuples:
        yield url
