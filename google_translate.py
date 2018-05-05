import requests

import consts


def _get_query_url(query: str, source_lang: str, target_lang: str) -> str:
    encoded_query = '%20'.join(query.split())
    return ('https://translate.googleapis.com/translate_a/single'
            '?client=gtx&dt=t&sl={}&tl={}&q={}').format(
                source_lang, target_lang, encoded_query)


def query(text: str, source_lang: str = 'es', target_lang: str = 'en') -> str:
    """Returns the translation from source_lang to target_lang for text."""
    url = _get_query_url(text, source_lang, target_lang)
    response = requests.get(url, headers=consts.REQUEST_HEADER)
    json = response.json()
    translation = json[0][0][0]
    return translation
