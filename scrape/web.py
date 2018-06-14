import bs4
import requests

from . import consts


def request(url: str) -> requests.Response:
    return requests.get(url, headers=consts.REQUEST_HEADER)


def get_html(url: str) -> bs4.BeautifulSoup:
    response = request(url)
    html = response.text
    return bs4.BeautifulSoup(html, 'html.parser')


def get_binary_content(url: str) -> bytes:
    response = request(url)
    return response.content
