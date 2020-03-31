# The Flash

## Design

```
. START
└── Input language
    └── Get top 10 words of that language
        ├── Get top 5 images for that word (images.google.com)
        ├── Get top 5 usages of that word (images.google.com)
        ├── Get top 5 pronunciations for that word (forvo.com)
        └── Get translations for that word (translate.google.com)
```

---

```
Define fields in the note
Define HtmlScrapers for each field
HtmlScraper<T> = {
  url: string,
  scrape: (html: string) => T[],
  choose: (choices: T[]) => T,
}

gen_csv:
    for each word:
        for each field:
            html = get(url)
            choices = scrape(html)
            choice = choose(choices)
        flush_to_csv
```
