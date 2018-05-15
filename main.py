#!/usr/bin/env python

import argparse
import itertools
import os
from typing import Any, List, Iterable, Tuple

import forvo
import google_images
import sentences


def _save_file(open_mode: str, content: Any, directory: str,
               file_name: str) -> None:
    if not os.path.exists(directory):
        os.makedirs(directory)
    path = os.path.join(directory, file_name)
    with open(path, open_mode) as f:
        f.write(content)


def _save_txt_file(content: str, directory: str, file_name: str) -> None:
    _save_file('w+', content, directory, file_name)


def _save_bin_file(content: bytes, directory: str, file_name: str) -> None:
    _save_file('wb+', content, directory, file_name)


def _sentence_with_translations_to_str(
        sentence_with_translation: Tuple[str, List[str]]) -> str:
    sentence, translations = sentence_with_translation
    stanza = '{}\n'.format(sentence) + '\n'.join(translations)
    return stanza


def _save_sentences_with_translations_to_dir(
        sentences_with_translations: Iterable[Tuple[str, List[str]]],
        directory: str,
        file_name: str,
        limit: int = None) -> None:
    sentences_with_translations_slice = itertools.islice(
        sentences_with_translations, limit)
    stanzas = (_sentence_with_translations_to_str(swt)
               for swt in sentences_with_translations_slice)
    content = '\n\n'.join(stanzas)
    _save_txt_file(content, directory, file_name)


def _save_imgs_to_dir(img_ext_tuples: Iterable[Tuple[str, str]],
                      directory: str,
                      limit: int = None) -> None:
    img_ext_tuples_slice = itertools.islice(img_ext_tuples, limit)
    for i, (img, ext) in enumerate(img_ext_tuples_slice):
        file_name = '{}.{}'.format(i, ext)
        _save_bin_file(img, directory, file_name)


def _save_mp3s_to_dir(mp3s: Iterable[bytes], directory: str,
                      limit: int = None) -> None:
    mp3s_slice = itertools.islice(mp3s, limit)
    for i, mp3 in enumerate(mp3s_slice):
        file_name = '{}.mp3'.format(i)
        _save_bin_file(mp3, directory, file_name)


def run_query(query: str,
              directory: str,
              num_example_sentences: int = None,
              num_images: int = None,
              num_pronunciations: int = None) -> None:
    sentences_with_translations = sentences.query(query)
    _save_sentences_with_translations_to_dir(sentences_with_translations,
                                             directory, 'sentences.txt',
                                             num_example_sentences)

    img_ext_tuples = google_images.query(query)
    _save_imgs_to_dir(img_ext_tuples, directory, num_images)

    mp3s = forvo.query(query)
    _save_mp3s_to_dir(mp3s, directory, num_pronunciations)


def run_queries(queries: Iterable[str],
                directory: str,
                num_example_sentences: int = None,
                num_images: int = None,
                num_pronunciations: int = None) -> None:
    for query in queries:
        underscored_query = query.replace(' ', '_')
        query_dir = os.path.join(directory, underscored_query)
        run_query(query, query_dir, num_example_sentences, num_images,
                  num_pronunciations)


def get_lines(file_name: str) -> Iterable[str]:
    with open(file_name, 'r') as f:
        return f.readlines()


def main() -> None:
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
    args = parser.parse_args()

    lines = get_lines(args.word_list)
    run_queries(lines, args.directory, args.num_example_sentences,
                args.num_images, args.num_pronunciations)


if __name__ == '__main__':
    main()
