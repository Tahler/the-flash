#!/usr/bin/env python3

import argparse
import itertools
import logging
import os
import sys
import time
from typing import Any, List, Iterable, Tuple

import html_tmpl
import images
from scrape import forvo, google_images, sentences

CARDS_PER_HTML_DOCUMENT = 100
_MAX_WIDTH = 400
_MAX_HEIGHT = 400


def _remove_special_chars(s: str) -> str:
    return s.encode('ascii', 'ignore').decode('utf-8')


def _save_file(open_mode: str, content: Any, directory: str,
               file_name: str) -> str:
    directory = _remove_special_chars(directory)
    file_name = _remove_special_chars(file_name)
    if not os.path.exists(directory):
        os.makedirs(directory)
    path = os.path.join(directory, file_name)
    with open(path, open_mode) as f:
        f.write(content)
    return path


def _save_txt_file(content: str, directory: str, file_name: str) -> str:
    return _save_file('w+', content, directory, file_name)


def _save_bin_file(content: bytes, directory: str, file_name: str) -> str:
    return _save_file('wb+', content, directory, file_name)


def _save_img_file(content: bytes, directory: str, file_name: str) -> str:
    path = _save_bin_file(content, directory, file_name)
    try:
        images.resize(path, _MAX_WIDTH, _MAX_HEIGHT)
    except Exception as e:
        logging.error('unable to resize image: %s', e)
    return path


def _save_imgs_to_dir(img_ext_tuples: Iterable[Tuple[bytes, str]],
                      directory: str) -> Iterable[str]:
    for i, (img, ext) in enumerate(img_ext_tuples):
        file_name = '{}.{}'.format(i, ext)
        yield _save_img_file(img, directory, file_name)


def _save_mp3s_to_dir(mp3s: Iterable[bytes], directory: str) -> Iterable[str]:
    for i, mp3 in enumerate(mp3s):
        file_name = '{}.mp3'.format(i)
        yield _save_bin_file(mp3, directory, file_name)


def run_query(query: str,
              directory: str,
              num_example_sentences: int = None,
              num_images: int = None,
              num_pronunciations: int = None) -> html_tmpl.Card:
    logging.info('scraping web for %s', query)

    sentences_with_translations = sentences.query(query)
    sentences_with_translations_slice = itertools.islice(
        sentences_with_translations, num_example_sentences)
    sentences_iter = (t[0] for t in sentences_with_translations_slice)

    img_ext_tuples = google_images.query(query)
    img_ext_tuples_slice = itertools.islice(img_ext_tuples, num_images)
    img_paths = _save_imgs_to_dir(img_ext_tuples_slice, directory)

    mp3s = forvo.query(query)
    mp3s_slice = itertools.islice(mp3s, num_pronunciations)
    mp3_paths = _save_mp3s_to_dir(mp3s_slice, directory)

    links = [
        ('Images', google_images._get_query_url(query)),
        ('Pronunciations', forvo._get_query_url(query)),
        ('Sentences', sentences._get_query_url(query)),
    ]

    return html_tmpl.Card(
        word=query,
        links=links,
        image_paths=list(img_paths),
        mp3_paths=list(mp3_paths),
        sentences=list(sentences_iter))


def cards_for_queries(
        queries: List[str],
        directory: str,
        num_example_sentences: int = None,
        num_images: int = None,
        num_pronunciations: int = None) -> Iterable[html_tmpl.Card]:
    for query in queries:
        underscored_query = query.replace(' ', '_')
        query_dir = os.path.join(directory, underscored_query)

        card = run_query(query, query_dir, num_example_sentences, num_images,
                         num_pronunciations)
        yield card


def get_lines(file_name: str) -> List[str]:
    with open(file_name, 'r') as f:
        return [line.strip() for line in f.readlines()]


def _save_cards_as_html(cards: List[html_tmpl.Card], directory: str,
                        file_name: str) -> None:
    html_str = html_tmpl.render(cards)
    _save_txt_file(html_str, directory, file_name)


def _save_cards_as_html_in_chunks(cards: Iterable[html_tmpl.Card],
                                  directory: str) -> None:
    i = 0
    last_flushed_index = i
    buffered_cards = []  # type: List[html_tmpl.Card]

    def flush_cards():
        file_name = '{}-{}.html'.format(last_flushed_index, i - 1)
        return _save_cards_as_html(buffered_cards, directory, file_name)

    try:
        for card in cards:
            i += 1
            buffered_cards.append(card)

            should_flush = i % CARDS_PER_HTML_DOCUMENT == 0
            if should_flush:
                flush_cards()

                last_flushed_index = i
                buffered_cards = []
    finally:
        flush_cards()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description='Scrape the web to help make Anki flash cards.')
    parser.add_argument(
        'word_list', type=str, help='file with words separated by line')
    parser.add_argument(
        '--num_example_sentences',
        default=1,
        type=int,
        help='number of example sentences to save')
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
    return parser.parse_args()


def main(args: argparse.Namespace) -> None:
    words = get_lines(args.word_list)
    cards = cards_for_queries(words, args.directory,
                              args.num_example_sentences, args.num_images,
                              args.num_pronunciations)
    _save_cards_as_html_in_chunks(cards, args.directory)


if __name__ == '__main__':
    logging.basicConfig(
        stream=sys.stdout,
        level=logging.DEBUG,
        format='%(levelname)s\t> %(message)s')
    args = parse_args()
    main(args)
