import bs4
import json
import requests
from typing import Iterable, Tuple

import consts
import soups


def _get_query_url(query: str) -> str:
    encoded_query = '+'.join(query.split())
    return 'https://www.google.com/search?q={}&tbm=isch'.format(encoded_query)


def _extract_image_urls(soup: bs4.BeautifulSoup) -> Iterable[Tuple[str, str]]:
    metadata_elements = soup.find_all('div', 'rg_meta')
    metadata_dicts = (json.loads(e.text) for e in metadata_elements)
    url_ext_tuples = ((d['ou'], d['ity']) for d in metadata_dicts)
    return url_ext_tuples


def _get_raw_image(url: str) -> bytes:
    response = requests.get(url, headers=consts.REQUEST_HEADER)
    return response.content


async def query(query: str) -> Iterable[Tuple[bytes, str]]:
    """Returns a generator of (raw_image, extension) for the query."""
    url = _get_query_url(query)
    soup = soups.get(url)
    url_ext_tuples = _extract_image_urls(soup)
    img_ext_tuples = ((_get_raw_image(url), ext)
                      for url, ext in url_ext_tuples)
    return img_ext_tuples
