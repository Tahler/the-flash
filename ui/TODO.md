# Needed

- Download flash cards in the right format
  - Create a template with spots for the word and up to three images, one audio, three examples?

# Next Steps

- Save flash cards to cloud

# Clean-up

- Create a CheckboxSelector and RadioSelector (branch: `selector`)
  - Each takes the list of tuples, `[[content, component]]`, and notifies
    `onSelectionChange`, gives the selected list of content
    (CheckboxSelector) or the selected content (RadioSelector)
    - Problem with this is that state is held in two places
- Use react-router?
- Customize audio control style
  - Just need play button
- Make a "page" class which becomes query params and grows size, etc.
- Bootstrap import components directly
