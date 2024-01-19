# textcat-ng

Webapp to compose avalanche bulletins and translate them to multiple languages.

![Screenshot](/uploads/1fa4ffe7f2f00798f9d3a8d8f5243925/Screenshot_2022-11-28_at_22-39-33_Avalanche.report.png)

## CLI Commands

<details>

- `yarn install`: Installs dependencies

- `yarn run dev`: Run a development, HMR server

- `yarn run serve`: Run a production-like server

- `yarn run build`: Production-ready build

- `yarn run lint`: Pass TypeScript files using TSLint

- `yarn run test`: Run Vitest for your tests

For detailed explanation on how things work, checkout the [CLI Readme](https://github.com/developit/preact-cli/blob/master/README.md).

</details>

## Deployment

```sh
# place satzkatalog in ../satzkatalog
$ find ../satzkatalog/data -name S010.txt -or -name Verhältnisse04§wo_wann3.txt
../satzkatalog/data/DE/Ranges/Verhältnisse04§wo_wann3.txt
../satzkatalog/data/DE/Sentences/S010.txt
../satzkatalog/data/EN/Ranges/Verhältnisse04§wo_wann3.txt
../satzkatalog/data/EN/Sentences/S010.txt
../satzkatalog/data/FR/Ranges/Verhältnisse04§wo_wann3.txt
../satzkatalog/data/FR/Sentences/S010.txt
../satzkatalog/data/IT/Ranges/Verhältnisse04§wo_wann3.txt
../satzkatalog/data/IT/Sentences/S010.txt
../satzkatalog/data/CA/Ranges/Verhältnisse04§wo_wann3.txt
../satzkatalog/data/CA/Sentences/S010.txt

# build textfiles to public/assets/
$ python3 build-textfiles.py
$ find public/assets/ -name '*txt'
public/assets/satzkatalog.CA.txt
public/assets/satzkatalog.DE.txt
public/assets/satzkatalog.EN.txt
public/assets/satzkatalog.ES.txt
public/assets/satzkatalog.FR.txt
public/assets/satzkatalog.IT.txt
public/assets/satzkatalog.OC.txt

$ yarn install
$ yarn run build
$ find dist
dist
dist/assets
dist/assets/satzkatalog.CA.txt
dist/assets/satzkatalog.DE.txt
dist/assets/satzkatalog.EN.txt
dist/assets/satzkatalog.ES.txt
dist/assets/satzkatalog.FR.txt
dist/assets/satzkatalog.IT.txt
dist/assets/satzkatalog.OC.txt
dist/assets/favicon.200974ef.ico
dist/assets/index.ae399452.js
dist/assets/vendor.9a886a7a.js
dist/assets/index.60a2f543.css
dist/index.html

# copy dist/ to webserver
```

## Enable DeepL translation for Joker sentences

Obtain a DeepL authentication key via https://www.deepl.com/pro-api, and configure `.env` with the following two environment variables:

```env
VITE_DEEPL_API=https://api-free.deepl.com/v2/translate
VITE_DEEPL_API_KEY=...:fx

```

## Translation

This project uses Transifex for its translations: https://www.transifex.com/albina-euregio/textcat-ng/dashboard/

## Author and License

- Author: Simon Legner ([simon04](https://gitlab.com/simon04))
- License: [GPL v3](https://www.gnu.org/licenses/gpl-3.0.en.html)
