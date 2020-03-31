def save_file(open_mode: str, content: Any, directory: str,
              file_name: str) -> str:
  directory = remove_special_chars(directory)
  file_name = remove_special_chars(file_name)
  if not os.path.exists(directory):
    os.makedirs(directory)
  path = os.path.join(directory, file_name)
  with open(path, open_mode) as f:
    f.write(content)
  return path


def save_txt_file(content: str, directory: str, file_name: str) -> str:
  return save_file('w+', content, directory, file_name)


def save_bin_file(content: bytes, directory: str, file_name: str) -> str:
  return save_file('wb+', content, directory, file_name)


def save_img_file(content: bytes, directory: str, file_name: str) -> str:
  path = save_bin_file(content, directory, file_name)
  try:
    images.resize(path, _MAX_WIDTH, _MAX_HEIGHT)
  except Exception as e:
    logging.error('unable to resize image: %s', e)
  return path


def save_imgs_to_dir(img_ext_tuples: Iterable[Tuple[bytes, str]],
                     directory: str) -> Iterable[str]:
  for i, (img, ext) in enumerate(img_ext_tuples):
    file_name = '{}.{}'.format(i, ext)
    yield save_img_file(img, directory, file_name)


def save_mp3s_to_dir(mp3s: Iterable[bytes], directory: str) -> Iterable[str]:
  for i, mp3 in enumerate(mp3s):
    file_name = '{}.mp3'.format(i)
    yield save_bin_file(mp3, directory, file_name)
