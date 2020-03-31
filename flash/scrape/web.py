import datetime
from functools import wraps
import logging
import pickle
import time
from typing import Mapping, Optional

import bs4
import requests

_REQUEST_HEADER = {
    'User-Agent': ('Mozilla/5.0 (Windows NT 6.1; WOW64) '
                   'AppleWebKit/537.36 (KHTML, like Gecko) '
                   'Chrome/80.0.3987.132 Safari/537.36')
}
RETRY_INTERVAL = datetime.timedelta(minutes=5)


def memoize(func):
  try:
    with open('cache') as f:
      func.cache = pickle.load(f)
      print('loaded', func.cache.keys())
  except:
    func.cache = {}

  @wraps(func)
  def wrapper(*args):
    try:
      return func.cache[args]
    except KeyError:
      result = func(*args)
      func.cache[args] = result
      with open('cache', 'wb') as f:
        pickle.dump(func.cache, f)
        print('wrote!')
      return result

  return wrapper


@memoize
def request(url: str,
            params: Optional[Mapping[str, str]] = None) -> requests.Response:
  while True:
    try:
      return requests.get(url, params=params, headers=_REQUEST_HEADER)
    except requests.exceptions.RequestException as e:
      logging.error('%s', e)
      logging.info('waiting %s before retrying', RETRY_INTERVAL)
      time.sleep(RETRY_INTERVAL.seconds)


def get_html(url: str) -> bs4.BeautifulSoup:
  response = request(url)
  html = response.text
  return bs4.BeautifulSoup(html, 'html.parser')


def get_binary_content(url: str) -> bytes:
  response = request(url)
  return response.content
