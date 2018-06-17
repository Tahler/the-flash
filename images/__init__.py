from typing import Tuple

from PIL import Image


def _scale_for_landscape(x: int, y: int, x2: int) -> Tuple[int, int]:
    ratio = float(x2 / x)
    y2 = int(y * ratio)
    return x2, y2


def resize(path: str, max_width: int, max_height: int) -> None:
    """Resizes the image at path in place.

    Force a max-width and max-height of 400px while keeping aspect-ratio.
    """
    img = Image.open(path)
    curr_w = img.size[0]
    curr_h = img.size[1]

    if curr_w >= curr_h:  # landscape or square
        target_w, target_h = _scale_for_landscape(curr_w, curr_h, max_width)
    else:  # portrait
        target_h, target_w = _scale_for_landscape(curr_h, curr_w, max_height)

    img = img.resize((target_w, target_h), Image.ANTIALIAS)
    img.save(path)  # Saves in place.
