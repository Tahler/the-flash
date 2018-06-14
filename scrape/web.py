import bs4
import requests

from . import consts


def get_html(url: str) -> bs4.BeautifulSoup:
    response = requests.get(url, headers=consts.REQUEST_HEADER)
    html = response.text
    return bs4.BeautifulSoup(html, 'html.parser')
