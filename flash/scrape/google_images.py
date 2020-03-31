import base64
import io
import json
from typing import List, Iterable, Tuple
from urllib import parse

import bs4
from PIL import Image
import requests

from . import web


def _get_query_url(query: str) -> str:
  encoded_query = parse.quote(query)
  return 'https://www.google.com.vn/search?q={}&tbm=isch'.format(encoded_query)


def _extract_image_urls(soup: bs4.BeautifulSoup) -> Iterable[Tuple[bytes, str]]:
  # print('AHH', soup)
  # TODO: results are in a table? Because of the user agent?
  img_tags = soup.find_all('img', {'class': 'rg_i'})
  # print(img_tags)
  for img_tag in img_tags[15:]:
    src = img_tag['src']
    print(src)
    params, encoded = src.split(';base64,', maxsplit=1)
    print(encoded)
    ext = params.split('/', maxsplit=1)
    img_data = base64.b64decode(encoded)
    print(str(img_data))
    yield img_data, ext

    # url = img_tag['src']
    # print(url)
    # if not url.startswith('http'):
    #   continue
    # TODO: if this is the last resort, get the extension from the response
    # header, 'Content-Type'
    # yield url, 'jpg'
    # print('AHH', element)
    # src =
    # js = json.loads(element.text)
    # print('AHH', js)
    # img_url = js['ou']
    # img_extension = js['ity']
    # if not img_extension:
    #   img_extension = 'jpg'
    # yield img_url, img_extension


def scrape(response: requests.Response) -> Iterable[Tuple[Image.Image, str]]:
  """Returns a generator of (raw_image, extension) for the query."""
  html = response.text
  soup = bs4.BeautifulSoup(html, 'html.parser')
  url_ext_tuples = _extract_image_urls(soup)
  for (data, ext) in url_ext_tuples:
    # data = web.get_binary_content(url)
    yield Image.open(io.BytesIO(data)), ext


def query(query: str) -> Iterable[Tuple[Image.Image, str]]:
  """Returns a generator of (raw_image, extension) for the query."""
  url = _get_query_url(query)
  response = web.request(url)
  return scrape(response)
