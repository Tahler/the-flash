import argparse
import csv
import io
import itertools
import logging
import mimetypes
import os
import sys
from typing import Generic, Iterable, List, Sequence, Tuple, TypeVar
import uuid

import bs4
import requests
from PIL import Image

from flash.scrape import web

T = TypeVar('T')

NUM_OPTIONS = 5

MEDIA_DIR = 'media'
TMP_DIR = 'tmp'


def _batch(iterable: Iterable[T], n: int) -> List[T]:
  return list(itertools.islice(iterable, n))


class Field:

  def __init__(self, header: str) -> None:
    self.header = header

  @classmethod
  def get_value(cls, word: str) -> str:
    return word


class ScrapedField(Field, Generic[T]):
  """Fetches HTML, scrapes it, and offers choices."""

  @classmethod
  @abc.abstractmethod
  def request(cls, word: str) -> requests.Response:
    pass

  @classmethod
  @abc.abstractmethod
  def scrape(cls, response: requests.Response) -> Iterable[T]:
    pass

  @classmethod
  @abc.abstractmethod
  def choose(cls, options: Iterable[T]) -> str:
    """Prompts the user in some way to choose from the options.

    If multiple options are picked, it is up to the implementation to join
    them into a single string.
    """
    pass

  @classmethod
  def get_value(cls, word: str) -> str:
    response = cls.request(word)
    options = cls.scrape(response)
    return cls.choose(options)


# TODO: Support getting more options.
# TODO: Sequence T -> List T
def select_many_from_list(options: Sequence[str]) -> List[int]:
  prefixed_options = '\n'.join(f'{i+1}) {v}' for i, v in enumerate(options))
  print(prefixed_options)
  while True:
    raw = input(f'Enter numbers between 1 and {len(options)}')
    try:
      one_based_choices = map(int, raw.split(' '))
      for c in one_based_choices:
        in_bounds = 0 < c and c <= len(options)
        if not in_bounds:
          raise ValueError(f'{c} is not between 1 and {len(options)}.')
      zero_based_choices = [x - 1 for x in one_based_choices]
      return zero_based_choices
    except Exception as e:
      print(e)


# A Pillow Image and its file extension (starting with '.').
ImageData = Tuple[Image.Image, str]


class ImageField(ScrapedField):

  @classmethod
  def request(cls, word: str) -> requests.Response:
    return requests.get('https://www.googleapis.com/customsearch/v1',
                        params={
                            'cr': 'countryVN',
                            'cx': '003071857971903801056:mfsbc9qdrkp',
                            'key': 'AIzaSyAjNOoDFEnKRnQF_h_Ro_dHxh_7HVKcv-Y',
                            'q': word,
                            'searchType': 'image',
                        })

  @classmethod
  def _get_image(cls, url: str) -> Tuple[Image.Image, str]:
    print(url)
    response = web.request(url)
    image = Image.open(io.BytesIO(response.content))
    mime_type = response.headers['Content-Type']
    file_ext = mimetypes.guess_extension(mime_type, strict=False) or '.jpg'
    return image, file_ext

  @classmethod
  def scrape(cls, response: requests.Response) -> Iterable[ImageData]:
    d = response.json()
    items = d['items']
    urls = [item['link'] for item in items]
    # TODO: After exhausting, fetch more.
    return [cls._get_image(url) for url in urls]

  @classmethod
  def choose(cls, options: Iterable[ImageData]) -> str:
    batch = _batch(options, NUM_OPTIONS)
    paths = []
    os.makedirs(TMP_DIR, exist_ok=True)
    for i, (img, ext) in enumerate(batch, start=1):
      path = os.path.join(TMP_DIR, f'{i}-{uuid.uuid4().hex}{ext}')
      img.save(path)
      openable_img = Image.open(path)
      print(openable_img.format)
      # openable_img.show()
      paths.append(path)
    choices = select_many_from_list(paths)
    chosen_paths = [paths[i] for i in choices]
    html_tags = [f'<img src="{path}">' for path in chosen_paths]
    return ''.join(html_tags)


FIELDS: List[Field] = [
    Field('word'),
    ImageField('images'),
]


def main() -> None:
  logging.basicConfig(stream=sys.stdout,
                      level=logging.DEBUG,
                      format='%(levelname)s\t> %(message)s')

  parser = argparse.ArgumentParser(
      description="generate a CSV for Anki ingestion")
  # parser.add_argument("word_list_path", type=str, default="freq.txt")
  parser.add_argument("--output_csv_path",
                      type=str,
                      default='out.csv',
                      help='where to output the csv')
  parser.add_argument("--media_dir",
                      type=str,
                      default='media',
                      help='where to store the audio/video files')
  args = parser.parse_args()

  # with open(args.word_list_path) as word_list_file:
  with open('freq.txt') as word_list_file:
    with open(args.output_csv_path, 'w') as csv_file:
      w = csv.writer(csv_file)
      headers = [field.header for field in FIELDS]
      w.writerow(headers)

      for line in word_list_file:
        word = line.strip()
        values = [field.get_value(word) for field in FIELDS]
        w.writerow([word, *values])


if __name__ == "__main__":
  main()
