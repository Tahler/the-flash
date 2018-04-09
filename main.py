#!/usr/bin/env python

import argparse
import itertools
import os
from typing import Any, Iterable, Tuple

import forvo
import google_images
import google_translate


def _save_file(open_mode: str, content: Any, directory: str, file_name: str) -> None:
    if not os.path.exists(directory):
        os.makedirs(directory)
    path = os.path.join(directory, file_name)
    with open(path, open_mode) as f:
        f.write(content)


def _save_txt_file(content: str, directory: str, file_name: str) -> None:
    _save_file('w+', content, directory, file_name)


def _save_bin_file(content: bytes, directory: str, file_name: str) -> None:
    _save_file('wb+', content, directory, file_name)


def _save_imgs_to_dir(img_ext_tuples: Iterable[Tuple[str, str]],
                      directory: str, limit: int) -> None:
    img_ext_tuples_slice = itertools.islice(img_ext_tuples, limit)
    for i, (img, ext) in enumerate(img_ext_tuples_slice):
        file_name = '{}.{}'.format(i, ext)
        _save_bin_file(img, directory, file_name)


def _save_mp3s_to_dir(mp3s: Iterable[bytes], directory: str,
                          limit: int) -> None:
    mp3s_slice = itertools.islice(mp3s, limit)
    for i, mp3 in enumerate(mp3s_slice):
        file_name = '{}.mp3'.format(i)
        _save_bin_file(mp3, directory, file_name)


def _run(query: str,
         directory: str,
         num_images: int = 5,
         num_pronunciations: int = 5) -> None:
    translation = google_translate.query(query)
    _save_txt_file(translation, directory, 'translation.txt')

    img_ext_tuples = google_images.query(query)
    _save_imgs_to_dir(img_ext_tuples, directory, num_images)

    mp3s = forvo.query(query)
    _save_mp3s_to_dir(mp3s, directory, num_pronunciations)


def main() -> None:
    parser = argparse.ArgumentParser(
        description='Scrape the web to help make Anki flash cards.')
    parser.add_argument('search', type=str, help='the search query')
    parser.add_argument(
        '--num_images', default=1, type=int, help='number of images to save')
    parser.add_argument(
        '--num_pronunciations',
        default=1,
        type=int,
        help='number of pronunciations to save')
    parser.add_argument(
        '-d',
        '--directory',
        default='out',
        type=str,
        help='directory to contain the scraped results')
    args = parser.parse_args()
    _run(args.search, args.directory, args.num_images, args.num_pronunciations)


if __name__ == '__main__':
    main()
