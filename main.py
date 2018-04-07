#!/usr/bin/env python

import argparse
import itertools
import os
from typing import Iterable, Tuple

import google_images


def _save_image(raw_image: bytes,
                directory: str,
                file_name: str,
                extension: str = 'jpg') -> None:
    path = os.path.join(directory, file_name + '.' + extension)
    with open(path, 'wb+') as f:
        f.write(raw_image)


def _download_images_to_dir(img_ext_tuples: Iterable[Tuple[str, str]],
                            directory: str, num_images: int) -> None:
    if not os.path.exists(directory):
        os.makedirs(directory)
    limit_img_ext_tuples = itertools.islice(img_ext_tuples, num_images)
    for i, (img, ext) in enumerate(limit_img_ext_tuples):
        _save_image(img, directory, str(i), ext)


def _run(query: str, directory: str, num_images: int = 100) -> None:
    img_ext_tuples = google_images.query(query)
    _download_images_to_dir(img_ext_tuples, directory, num_images)


def main() -> None:
    parser = argparse.ArgumentParser(
        description='Scrape and save images from Google Images')
    parser.add_argument('search', type=str, help='the search query')
    parser.add_argument(
        '-n',
        '--num_images',
        default=1,
        type=int,
        help='number of images to save')
    parser.add_argument(
        '-d',
        '--directory',
        default='google_images',
        type=str,
        help='directory to contain the images')
    args = parser.parse_args()
    _run(args.search, args.directory, args.num_images)


if __name__ == '__main__':
    main()
