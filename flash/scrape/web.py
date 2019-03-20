import datetime
import logging
import time

import bs4
import requests

_REQUEST_HEADER = {
    'User-Agent': ('Mozilla/5.0 (Windows NT 6.1; WOW64) '
                   'AppleWebKit/537.36 (KHTML, like Gecko) '
                   'Chrome/43.0.2357.134 Safari/537.36')
}
RETRY_INTERVAL = datetime.timedelta(minutes=5)


def request(url: str) -> requests.Response:
    while True:
        try:
            return requests.get(url, headers=_REQUEST_HEADER)
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
