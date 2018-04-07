import bs4
import json
import requests
from typing import Iterable, Tuple

REQUEST_HEADER = {
    'User-Agent': ('Mozilla/5.0 (Windows NT 6.1; WOW64) '
                   'AppleWebKit/537.36 (KHTML, like Gecko) '
                   'Chrome/43.0.2357.134 Safari/537.36')
}


def _get_query_url(query: str) -> str:
    encoded_query = '+'.join(query.split())
    return 'https://www.google.com/search?q={}&tbm=isch'.format(encoded_query)


def _get_soup(url: str) -> bs4.BeautifulSoup:
    response = requests.get(url, headers=REQUEST_HEADER)
    html = response.text
    return bs4.BeautifulSoup(html, 'html.parser')


def _extract_image_urls(soup: bs4.BeautifulSoup) -> Iterable[Tuple[str, str]]:
    metadata_elements = soup.find_all('div', 'rg_meta')
    metadata_dicts = (json.loads(e.text) for e in metadata_elements)
    url_ext_tuples = ((d['ou'], d['ity']) for d in metadata_dicts)
    return url_ext_tuples


def _get_raw_image(url: str) -> bytes:
    response = requests.get(url, headers=REQUEST_HEADER)
    return response.content


def query(query: str) -> Iterable[Tuple[bytes, str]]:
    """Returns a generator of (raw_image, extension) for the query."""
    url = _get_query_url(query)
    soup = _get_soup(url)
    url_ext_tuples = _extract_image_urls(soup)
    img_ext_tuples = ((_get_raw_image(url), ext)
                      for url, ext in url_ext_tuples)
    return img_ext_tuples
