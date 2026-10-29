## 9.0.0 (2026-10-28)

- Support dark mode ([7b10600](https://gitlab.com/albina-euregio/textcat-ng/commit/7b10600))
- Undo removing a sentence ([fd0ab23](https://gitlab.com/albina-euregio/textcat-ng/commit/fd0ab23))
- Reorder sentences with Alt+ArrowUp/Down ([b130b66](https://gitlab.com/albina-euregio/textcat-ng/commit/b130b66))
- Show loading and empty states ([aa00559](https://gitlab.com/albina-euregio/textcat-ng/commit/aa00559))
- Label search mode buttons with text and indicate the active search mode ([1969ad7](https://gitlab.com/albina-euregio/textcat-ng/commit/1969ad7), [adbe573](https://gitlab.com/albina-euregio/textcat-ng/commit/adbe573))
- Highlight "Save" as primary action ([54ca2ee](https://gitlab.com/albina-euregio/textcat-ng/commit/54ca2ee))
- Refresh design: square, flat form controls and buttons, more spacing in boxes ([cd1353e](https://gitlab.com/albina-euregio/textcat-ng/commit/cd1353e), [253b957](https://gitlab.com/albina-euregio/textcat-ng/commit/253b957))
- Add Slovenian, Polish and Slovak user interface translations ([f1701ae](https://gitlab.com/albina-euregio/textcat-ng/commit/f1701ae), [a1c5604](https://gitlab.com/albina-euregio/textcat-ng/commit/a1c5604))
- Translate all user interface messages ([fe59fd0](https://gitlab.com/albina-euregio/textcat-ng/commit/fe59fd0))
- Accessibility: visible keyboard focus, better color contrast, accessible names for buttons and form fields, page heading and document language for screen readers ([af1e636](https://gitlab.com/albina-euregio/textcat-ng/commit/af1e636), [befb800](https://gitlab.com/albina-euregio/textcat-ng/commit/befb800), [f064994](https://gitlab.com/albina-euregio/textcat-ng/commit/f064994), [f7590d6](https://gitlab.com/albina-euregio/textcat-ng/commit/f7590d6), [1700e6c](https://gitlab.com/albina-euregio/textcat-ng/commit/1700e6c), [ca978af](https://gitlab.com/albina-euregio/textcat-ng/commit/ca978af))
- Fix: enable joker sentences on dev.avalanche.report ([3fdd674](https://gitlab.com/albina-euregio/textcat-ng/commit/3fdd674))

## 8.0.0 (2025-11-04)

- Translate incomplete sentences, marking missing phrases with ⚠, instead of showing an error ([c8db44a](https://gitlab.com/albina-euregio/textcat-ng/commit/c8db44a))
- Scroll phrases of a sentence horizontally, with a tip on using mouse wheel and Shift key ([1f48c12](https://gitlab.com/albina-euregio/textcat-ng/commit/1f48c12), [d1c1c54](https://gitlab.com/albina-euregio/textcat-ng/commit/d1c1c54))
- Always load the latest text catalogue ([ccd9b83](https://gitlab.com/albina-euregio/textcat-ng/commit/ccd9b83))
- Typography: replace `(-)` also after a word ([52364f7](https://gitlab.com/albina-euregio/textcat-ng/commit/52364f7))
- Fix: enable joker sentences when DeepL is configured ([14c65be](https://gitlab.com/albina-euregio/textcat-ng/commit/14c65be))
- Editor: switch between header and curly name ([dde7d04](https://gitlab.com/albina-euregio/textcat-ng/commit/dde7d04), [336d42a](https://gitlab.com/albina-euregio/textcat-ng/commit/336d42a))
- Editor: retain Begin/End lines when saving `{Gebiet}` ([31976b7](https://gitlab.com/albina-euregio/textcat-ng/commit/31976b7))

## 7.0.0 (2024-12-07)

- Copy the whole text, and paste sentences or whole texts ([0f22290](https://gitlab.com/albina-euregio/textcat-ng/commit/0f22290), [d25f66a](https://gitlab.com/albina-euregio/textcat-ng/commit/d25f66a))
- Only show phrase lines of the selected region ([b7fcc7b](https://gitlab.com/albina-euregio/textcat-ng/commit/b7fcc7b))
- Reset the sentence search after adding a sentence ([ae174d7](https://gitlab.com/albina-euregio/textcat-ng/commit/ae174d7))
- Hide the translations heading when translations are hidden ([b1415de](https://gitlab.com/albina-euregio/textcat-ng/commit/b1415de))
- Rename submit button to "Save", restyle and reorder buttons ([ed12377](https://gitlab.com/albina-euregio/textcat-ng/commit/ed12377), [321b554](https://gitlab.com/albina-euregio/textcat-ng/commit/321b554), [7d32f29](https://gitlab.com/albina-euregio/textcat-ng/commit/7d32f29))
- Read-only mode, search while typing, and configurable sentence list and move buttons (for SLF) ([5336565](https://gitlab.com/albina-euregio/textcat-ng/commit/5336565), [56f16c8](https://gitlab.com/albina-euregio/textcat-ng/commit/56f16c8), [a37c9e9](https://gitlab.com/albina-euregio/textcat-ng/commit/a37c9e9))
- Faster search and translation using Web Workers ([6b7b584](https://gitlab.com/albina-euregio/textcat-ng/commit/6b7b584), [23ec834](https://gitlab.com/albina-euregio/textcat-ng/commit/23ec834), [447eb72](https://gitlab.com/albina-euregio/textcat-ng/commit/447eb72))
- Fix switching the user interface language ([5062902](https://gitlab.com/albina-euregio/textcat-ng/commit/5062902))
- Editor: rename and delete phrases ([9cfd932](https://gitlab.com/albina-euregio/textcat-ng/commit/9cfd932), [bfcf3b5](https://gitlab.com/albina-euregio/textcat-ng/commit/bfcf3b5))
- Editor: add multiple phrase lines at once (separated by semicolon) ([0d5e398](https://gitlab.com/albina-euregio/textcat-ng/commit/0d5e398))
- Editor: translated user interface and button tooltips ([23d1b68](https://gitlab.com/albina-euregio/textcat-ng/commit/23d1b68), [c94cb49](https://gitlab.com/albina-euregio/textcat-ng/commit/c94cb49))
- Editor: fix adding a line to `_NO` phrases ([08eb24b](https://gitlab.com/albina-euregio/textcat-ng/commit/08eb24b))

## <small>6.1.2 (2024-03-01)</small>

- Re-enable joker sentences on admin.avalanche.report only ([d5c345e](https://gitlab.com/albina-euregio/textcat-ng/commit/d5c345e))

## <small>6.1.1 (2024-03-01)</small>

- Disable joker sentences ([bc5f71a](https://gitlab.com/albina-euregio/textcat-ng/commit/bc5f71a))

## 6.1.0 (2024-01-26)

- Translate to Austrian and Swiss German (de_AT, de_CH) ([8411497](https://gitlab.com/albina-euregio/textcat-ng/commit/8411497), [bbf166c](https://gitlab.com/albina-euregio/textcat-ng/commit/bbf166c), [255f147](https://gitlab.com/albina-euregio/textcat-ng/commit/255f147))
- Translate joker sentences using DeepL ([2c8656a](https://gitlab.com/albina-euregio/textcat-ng/commit/2c8656a))
- Order languages to group similar ones ([8e05b6c](https://gitlab.com/albina-euregio/textcat-ng/commit/8e05b6c))
- New editor for the Satzkatalog ([40f2065](https://gitlab.com/albina-euregio/textcat-ng/commit/40f2065)):
  - open a local Satzkatalog folder, reload it, and write changes back to its files ([08b0320](https://gitlab.com/albina-euregio/textcat-ng/commit/08b0320), [0117d29](https://gitlab.com/albina-euregio/textcat-ng/commit/0117d29), [0dc7d68](https://gitlab.com/albina-euregio/textcat-ng/commit/0dc7d68))
  - edit sentences and phrases in all languages, including headers and `_NO` phrases ([86ed243](https://gitlab.com/albina-euregio/textcat-ng/commit/86ed243), [ebdc8b3](https://gitlab.com/albina-euregio/textcat-ng/commit/ebdc8b3), [84d33e6](https://gitlab.com/albina-euregio/textcat-ng/commit/84d33e6), [faf5538](https://gitlab.com/albina-euregio/textcat-ng/commit/faf5538), [9c816dc](https://gitlab.com/albina-euregio/textcat-ng/commit/9c816dc))
  - add sentences, phrases and phrase lines; move phrase lines ([6cf8297](https://gitlab.com/albina-euregio/textcat-ng/commit/6cf8297), [5614f14](https://gitlab.com/albina-euregio/textcat-ng/commit/5614f14), [70a6338](https://gitlab.com/albina-euregio/textcat-ng/commit/70a6338))
  - preview changes in the phrase composer and translations ([a10286f](https://gitlab.com/albina-euregio/textcat-ng/commit/a10286f), [332ec63](https://gitlab.com/albina-euregio/textcat-ng/commit/332ec63))
  - show usages of phrases and sentences, and navigate by clicking them ([21cfc83](https://gitlab.com/albina-euregio/textcat-ng/commit/21cfc83), [aadbaeb](https://gitlab.com/albina-euregio/textcat-ng/commit/aadbaeb), [c96b930](https://gitlab.com/albina-euregio/textcat-ng/commit/c96b930), [870ed0f](https://gitlab.com/albina-euregio/textcat-ng/commit/870ed0f))
  - spell check for inputs ([e295afa](https://gitlab.com/albina-euregio/textcat-ng/commit/e295afa))

## 6.0.0 (2023-11-23)

- Add joker sentences (free text) ([a170f18](https://gitlab.com/albina-euregio/textcat-ng/commit/a170f18))
- Copy and paste sentences, where supported by the browser ([ea738cf](https://gitlab.com/albina-euregio/textcat-ng/commit/ea738cf), [f3ccb47](https://gitlab.com/albina-euregio/textcat-ng/commit/f3ccb47), [d396a34](https://gitlab.com/albina-euregio/textcat-ng/commit/d396a34))

## 4.0.0 (2021-11-23)

- Reorder sentences with drag and drop ([7945417](https://gitlab.com/albina-euregio/textcat-ng/commit/7945417))
- Checkbox to show/hide translations ([7540813](https://gitlab.com/albina-euregio/textcat-ng/commit/7540813))
- Highlight search matches ([02d5ef5](https://gitlab.com/albina-euregio/textcat-ng/commit/02d5ef5))
- Show the affected sentence in error messages ([79843ca](https://gitlab.com/albina-euregio/textcat-ng/commit/79843ca), [c392af9](https://gitlab.com/albina-euregio/textcat-ng/commit/c392af9))
- Show the last modification date of the Satzkatalog ([611b650](https://gitlab.com/albina-euregio/textcat-ng/commit/611b650))
- Improve button padding ([26ef22a](https://gitlab.com/albina-euregio/textcat-ng/commit/26ef22a))

## <small>3.0.4 (2020-12-02)</small>

- Show the sentence header in the phrase composer ([4b6b8e9](https://gitlab.com/albina-euregio/textcat-ng/commit/4b6b8e9))

## <small>3.0.3 (2020-12-02)</small>

- Fix Occitan language code ([5522bd9](https://gitlab.com/albina-euregio/textcat-ng/commit/5522bd9), [5b00412](https://gitlab.com/albina-euregio/textcat-ng/commit/5b00412))
- Start with an empty text instead of a default sentence ([de6cce3](https://gitlab.com/albina-euregio/textcat-ng/commit/de6cce3))

## <small>3.0.2 (2020-12-01)</small>

- Fix handling of colons (Doppelpunkt) in the Satzkatalog ([7443818](https://gitlab.com/albina-euregio/textcat-ng/commit/7443818))
- Fix losing the text sent by albina-admin-gui before the app is initialized ([2c0fb79](https://gitlab.com/albina-euregio/textcat-ng/commit/2c0fb79))
- Use the full width for the phrase composer ([bd0488e](https://gitlab.com/albina-euregio/textcat-ng/commit/bd0488e))

## <small>3.0.1 (2020-11-30)</small>

- Deployment changes only

## 3.0.0 (2020-11-27)

Initial release of textcat-ng.

- Compose avalanche bulletin texts from the sentences and phrases of the Satzkatalog ([c666ccc](https://gitlab.com/albina-euregio/textcat-ng/commit/c666ccc), [3ee85ee](https://gitlab.com/albina-euregio/textcat-ng/commit/3ee85ee), [90427f3](https://gitlab.com/albina-euregio/textcat-ng/commit/90427f3))
- Search sentences by prefix or by keywords ([11693fb](https://gitlab.com/albina-euregio/textcat-ng/commit/11693fb), [ac081b6](https://gitlab.com/albina-euregio/textcat-ng/commit/ac081b6), [fa1c68c](https://gitlab.com/albina-euregio/textcat-ng/commit/fa1c68c))
- Preview a sentence before adding it ([eebf248](https://gitlab.com/albina-euregio/textcat-ng/commit/eebf248))
- Move and remove sentences ([5818a3e](https://gitlab.com/albina-euregio/textcat-ng/commit/5818a3e))
- Collapsible phrases with translated summary ([b855fce](https://gitlab.com/albina-euregio/textcat-ng/commit/b855fce), [2e3561a](https://gitlab.com/albina-euregio/textcat-ng/commit/2e3561a))
- Translate the text to all languages (de, en, it, fr, es, ca, Aranese) and show the translations in a table ([41467fd](https://gitlab.com/albina-euregio/textcat-ng/commit/41467fd), [36a7e19](https://gitlab.com/albina-euregio/textcat-ng/commit/36a7e19), [67c9333](https://gitlab.com/albina-euregio/textcat-ng/commit/67c9333))
- Correct typography of translated texts ([5ea5af0](https://gitlab.com/albina-euregio/textcat-ng/commit/5ea5af0), [d73aec4](https://gitlab.com/albina-euregio/textcat-ng/commit/d73aec4), [2129783](https://gitlab.com/albina-euregio/textcat-ng/commit/2129783))
- Select input language and region; hide options not matching the region ([a8679b7](https://gitlab.com/albina-euregio/textcat-ng/commit/a8679b7), [feb82da](https://gitlab.com/albina-euregio/textcat-ng/commit/feb82da))
- Show warnings for incomplete sentences ([5f73602](https://gitlab.com/albina-euregio/textcat-ng/commit/5f73602), [99dfddd](https://gitlab.com/albina-euregio/textcat-ng/commit/99dfddd))
- Integration with albina-admin-gui ([6b36ae5](https://gitlab.com/albina-euregio/textcat-ng/commit/6b36ae5))
- User interface translated via Transifex ([1a39ff7](https://gitlab.com/albina-euregio/textcat-ng/commit/1a39ff7))
- Show version in footer ([2a2336d](https://gitlab.com/albina-euregio/textcat-ng/commit/2a2336d))
