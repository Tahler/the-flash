#!/usr/bin/env python

import argparse
import itertools
import os
from typing import Any, List, Iterable, Tuple

import forvo
import google_images
import html_doc
import sentences

WORDS_PER_HTML_DOCUMENT = 100


def _save_file(open_mode: str, content: Any, directory: str,
               file_name: str) -> os.PathLike:
    if not os.path.exists(directory):
        os.makedirs(directory)
    path = os.path.join(directory, file_name)
    with open(path, open_mode) as f:
        f.write(content)
    return path


def _save_txt_file(content: str, directory: str,
                   file_name: str) -> os.PathLike:
    return _save_file('w+', content, directory, file_name)


def _save_bin_file(content: bytes, directory: str,
                   file_name: str) -> os.PathLike:
    return _save_file('wb+', content, directory, file_name)


def _save_imgs_to_dir(img_ext_tuples: Iterable[Tuple[str, str]],
                      directory: str) -> Iterable[os.PathLike]:
    for i, (img, ext) in enumerate(img_ext_tuples):
        file_name = '{}.{}'.format(i, ext)
        yield _save_bin_file(img, directory, file_name)


def _save_mp3s_to_dir(mp3s: Iterable[bytes],
                      directory: str) -> Iterable[os.PathLike]:
    for i, mp3 in enumerate(mp3s):
        file_name = '{}.mp3'.format(i)
        yield _save_bin_file(mp3, directory, file_name)


def run_query(query: str,
              directory: str,
              num_example_sentences: int = None,
              num_images: int = None,
              num_pronunciations: int = None) -> html_doc.Word:
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

    return html_doc.Word(
        word=query,
        links=links,
        image_paths=img_paths,
        mp3_paths=mp3_paths,
        sentences=sentences_iter)


def run_queries(queries: Iterable[str],
                directory: str,
                num_example_sentences: int = None,
                num_images: int = None,
                num_pronunciations: int = None) -> Iterable[html_doc.Word]:
    for query in queries:
        underscored_query = query.replace(' ', '_')
        query_dir = os.path.join(directory, underscored_query)
        word = run_query(query, query_dir, num_example_sentences, num_images,
                         num_pronunciations)
        yield word


def get_lines(file_name: str) -> Iterable[str]:
    with open(file_name, 'r') as f:
        return (line.strip() for line in f.readlines())


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
    words = run_queries(lines, args.directory, args.num_example_sentences,
                        args.num_images, args.num_pronunciations)

    buffered_words = []
    for i, word in enumerate(words):
        buffered_words.append(word)
        if (i + 1) % WORDS_PER_HTML_DOCUMENT == 0:
            first_buffered_word_index = i + 1 - len(buffered_words)
            file_name = '{}-{}.html'.format(first_buffered_word_index, i)
            html_str = html_doc.render(buffered_words)
            _save_txt_file(html_str, args.directory, file_name)
            buffered_words = []

    html_str = html_doc.render(buffered_words)
    file_name = '{}-{}.html'.format(
        len(words) - len(buffered_words), len(buffered_words))
    _save_txt_file(html_str, args.directory, file_name)


if __name__ == '__main__':
    main()
