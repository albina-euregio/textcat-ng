import {
  CurlyName,
  IntlText,
  isPhrase,
  isSentence,
  Lang,
  LANGUAGES,
  FULL_STOP,
  longestCommonPrefix,
  mapLineFragment,
  mergeIntlText,
  newPhrase,
  Phrase,
  Sentence,
  uniqueLineFragments,
  WrittenPhrase,
  WrittenText,
  isJoker,
  Joker,
  sentencePreview
} from ".";
import { t } from "../i18n";

export class UnknownLineError extends Error {
  constructor(line: number, context: string) {
    super(t("unknownLine", line, context));
  }
}

export class UnknownPhraseError extends Error {
  constructor(phrase: string) {
    super(t("unknownPhrase", phrase));
  }
}

export class UnsetPhraseError extends Error {
  constructor(phrase: string) {
    super(t("unsetPhrase", phrase));
  }
}

export class IncompleteJokerError extends Error {
  constructor() {
    super(t("incompleteJoker"));
  }
}

export enum SearchMode {
  PREFIX,
  WORDS
}

export class TextCatalogue {
  public readonly lang: Lang;
  private data: Record<CurlyName, Phrase> = {};
  public sentences: Sentence[] = [];
  public phrases: Phrase[] = [];
  public readonly regions: Set<string> = new Set<string>();
  public readonly wordToPhraseMap: Map<string, Set<string>> = new Map();
  public lastModified?: string;

  constructor(lang: Lang) {
    this.lang = lang;
  }

  sentence(curlyName: CurlyName): Sentence | undefined {
    const sentence = this.data[curlyName];
    return isSentence(sentence) ? sentence : undefined;
  }

  searchSentences(query: string, mode = SearchMode.WORDS): Sentence[] {
    query = query.toLowerCase();
    if (mode === SearchMode.PREFIX) {
      return this.sentences.filter(s => this.hasPrefix(s, query) === "");
    } else {
      const words = this.splitSearchText(query);
      return this.sentences.filter(s =>
        words.every(word => this.containsString(s, word))
      );
    }
  }

  splitSearchText(searchText: string): string[] {
    return searchText.toLowerCase().split(/[\s.:,]+/g);
  }

  /**
   * Tests whether the given phrase starts with the given prefix
   * @param phrase the phrase to test
   * @param prefix the prefix to test
   * @returns false or the remaining prefix (after this phrase)
   */
  private hasPrefix(
    phrase: Phrase | undefined,
    prefix: string
  ): false | string {
    if (phrase === undefined) return false;
    if (prefix.length === 0) return "";
    const PREFIX = prefix;
    const r = new Set<string>();
    LINES: for (const { lineFragments } of phrase.lines) {
      let prefix = PREFIX;
      for (const lineFragment of lineFragments ?? []) {
        if (prefix.length === 0) return "";
        const falseOrRemaining = mapLineFragment(
          lineFragment,
          (curlyName, curlyNameSuffix) => {
            const p = this.phrase(curlyName + curlyNameSuffix);
            return this.hasPrefix(p, prefix);
            //TODO
          },
          text => {
            if (text === "[Empty]") return prefix;
            text = text.toLowerCase();
            const commonPrefix = longestCommonPrefix(text, prefix);
            if (text === commonPrefix) {
              return prefix.substring(commonPrefix.length).trim();
            } else if (prefix === commonPrefix) {
              return "";
            } else {
              return false;
            }
          }
        );
        if (falseOrRemaining === false) {
          continue LINES;
        } else {
          prefix = falseOrRemaining;
        }
      }
      r.add(prefix);
    }
    // return the shortest remaining prefix
    return r.size
      ? Array.from(r).reduce((p1, p2) => (p1.length < p2.length ? p1 : p2))
      : false;
  }

  /**
   * Tests whether the given phrase contains the given string
   * @param phrase the phrase to test
   * @param string the string to test
   * @returns whether the given phrase contains the given string
   */
  private containsString(phrase: Phrase | undefined, string: string): boolean {
    if (phrase === undefined) return false;
    if (phrase.header.toLowerCase().includes(string)) return true;
    return phrase.lines.some(
      ({ lineFragments }) =>
        lineFragments?.some(lineFragment =>
          mapLineFragment(
            lineFragment,
            (curlyName, curlyNameSuffix) => {
              const p = this.phrase(curlyName + curlyNameSuffix);
              return this.containsString(p, string);
            },
            text => text.toLowerCase().includes(string)
          )
        )
    );
  }

  phrase(curlyName: CurlyName): Phrase | undefined {
    return this.data[curlyName];
  }

  parse(text: string): this {
    let current: Sentence | Phrase | undefined;
    let currentRegion: string | undefined = undefined;
    text.split(/[\r\n]+/).forEach(line => {
      if (!line) {
        return;
      }
      const colonIndex = line.indexOf(":");
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      switch (key) {
        case "ST_Header":
          current = {
            $type: "Sentence",
            header: value,
            curlyName: "",
            lines: [
              {
                line: "",
                lineFragments: []
              }
            ]
          };
          break;
        case "ST_CurlyName":
          if (isSentence(current)) {
            current.curlyName = value;
            this.data[current.curlyName] = current;
          } else {
            console.warn("Ignoring", line);
          }
          break;
        case "PA_Pos":
          if (isSentence(current)) {
            // ignore PA_Pos
          } else {
            console.warn("Ignoring", line);
          }
          break;
        case "PA_PosGerman":
          if (isSentence(current)) {
            // ignore PA_PosGerman
          } else {
            console.warn("Ignoring", line);
          }
          break;
        case "RS_Header":
          current = {
            $type: "Phrase",
            header: value,
            curlyName: "",
            lines: []
          };
          break;
        case "RS_CurlyName":
          if (isSentence(current)) {
            current.lines[0].lineFragments?.push(`{${value}}`);
          } else if (isPhrase(current)) {
            current.curlyName = value;
            this.data[current.curlyName] = current;
          }
          break;
        case "Line":
          if (isPhrase(current)) {
            current.lines?.push({
              line: value,
              lineFragments: (value.match(/{[^}]+}|[^{}]+/g) ?? [])
                .map(s => s.trim())
                .filter(s => s.length),
              region: currentRegion
            });
          }
          break;
        case "Begin":
          currentRegion = value;
          this.regions.add(currentRegion);
          break;
        case "End":
          currentRegion = undefined;
          break;
        default:
          console.warn("Ignoring", line);
      }
    });
    this.phrases = Object.values(this.data);
    this.sentences = Object.values(this.data)
      .filter(isSentence)
      .sort((s1, s2) => s1.header.localeCompare(s2.header));
    return this;
  }

  translateLineFragments(lineFragments?: string[]): IntlText {
    if (!lineFragments || lineFragments.length === 0) return "";
    return lineFragments
      .filter(lineFragment => lineFragment !== FULL_STOP)
      .map(lineFragment =>
        mapLineFragment<string>(
          lineFragment,
          (curlyName, curlyNameSuffix) =>
            "{" + this.phrase(curlyName + curlyNameSuffix)?.header + "}",
          text => text
        )
      )
      .reduce(mergeIntlText);
  }

  translate(writtenText: WrittenText): IntlText {
    if (!writtenText || writtenText.length === 0) return "";
    return writtenText
      .map(writtenPhrase => this.translateSentence(writtenPhrase))
      .reduce(mergeIntlText)
      .replace(/[.:]\s+\(--\)/g, "");
  }

  private translateSentence(writtenPhrase: WrittenPhrase): IntlText {
    try {
      return this.translatePhrase(writtenPhrase, "")
        .replace(/\[Empty\] /g, "")
        .replace(/ \[Empty\]/g, "")
        .replace(/\s+\(-\)/g, "")
        .replace(/^./, s => s.toLocaleUpperCase(this.lang));
    } catch (e) {
      if (e instanceof UnsetPhraseError) {
        const phrase = this.phrase(writtenPhrase.curlyName);
        if (isSentence(phrase)) {
          e.message += ` \u2014 ${phrase.header}`;
        }
      }
      throw e;
    }
  }

  private translateJoker(writtenPhrase: Joker): IntlText {
    const text = writtenPhrase.args[this.lang];
    if (!text) {
      throw new IncompleteJokerError();
    }
    return text;
  }

  translatePhrase(
    writtenPhrase: WrittenPhrase,
    curlyNameSuffix: string
  ): IntlText {
    if (isJoker(writtenPhrase)) {
      return this.translateJoker(writtenPhrase);
    }

    const phrase = this.phrase(writtenPhrase.curlyName + curlyNameSuffix);
    if (!phrase) throw new UnknownPhraseError(writtenPhrase.curlyName);

    const lineFragments =
      phrase?.lines[writtenPhrase.line]?.lineFragments ??
      uniqueLineFragments(phrase) ??
      undefined;
    if (!lineFragments && writtenPhrase.line >= 0)
      throw new UnknownLineError(writtenPhrase.line, writtenPhrase.curlyName);
    else if (!lineFragments)
      throw new UnsetPhraseError(writtenPhrase.curlyName);

    return lineFragments
      .map(lineFragment =>
        mapLineFragment(
          lineFragment,
          (curlyName, curlyNameSuffix) =>
            this.translatePhrase(
              writtenPhrase?.args?.[curlyName] ?? newPhrase(curlyName),
              curlyNameSuffix
            ),
          text => text
        )
      )
      .reduce(mergeIntlText);
  }

  previewPhrase(
    writtenPhrase: WrittenPhrase,
    curlyNameSuffix: string,
    showError?: boolean
  ): IntlText {
    if (isJoker(writtenPhrase)) {
      try {
        return this.translateJoker(writtenPhrase);
      } catch (e) {
        return `⚠ ${e}`;
      }
    }
    const phrase = this.phrase(writtenPhrase.curlyName + curlyNameSuffix);
    if (!phrase) return "";
    try {
      const translation = this.translatePhrase(writtenPhrase, curlyNameSuffix);
      return isSentence(phrase)
        ? sentencePreview(phrase, this, translation)
        : translation;
    } catch (e) {
      return isSentence(phrase) && showError
        ? `⚠ ${e} \u2014 ${sentencePreview(phrase, this)}`
        : isSentence(phrase)
        ? sentencePreview(phrase, this)
        : `{${phrase.header}}: ⚠ ${e}`;
    }
  }

  updateLastModified(lastModifiedString: string | null) {
    if (!lastModifiedString) return;
    const lastModified = new Date(lastModifiedString)
      .toISOString()
      .slice(0, "2021-11-18".length);
    if (!this.lastModified || this.lastModified < lastModified) {
      this.lastModified = lastModified;
    }
  }
}

export async function buildTextcat(lang: Lang): Promise<TextCatalogue> {
  // awk '{print $0}' DE/Sentences/* DE/Ranges/* > assets/satzkatalog.DE.txt
  const file = `satzkatalog.${lang.toUpperCase()}.txt`;
  const catalog = new TextCatalogue(lang);
  try {
    const response = await fetch(`./assets/${file}`);
    if (!response.ok) throw response.statusText;
    const text = await response.text();
    console.time(`parse ${file}`);
    catalog.parse(text);
    catalog.updateLastModified(response.headers.get("Last-Modified"));
    console.timeEnd(`parse ${file}`);
  } catch (e) {
    throw new Error(`Failed to build textcat from ${file}: ${e}`);
  }
  return catalog;
}

export async function buildAllTextcat(): Promise<TextCatalogue[]> {
  return Promise.all(LANGUAGES.map(lang => buildTextcat(lang)));
}

export type Translations = Record<Lang | "de_AT", IntlText>;

export function translateAll(
  catalogs: TextCatalogue[],
  writtenText: WrittenText
): Translations {
  console.time("translateAll");
  const translation = {} as Translations;
  catalogs.forEach(catalog => {
    const { lang } = catalog;
    try {
      translation[lang] = catalog.translate(writtenText);
      if (lang === "de") {
        translation["de_AT"] = translateGerman(translation[lang]);
      }
    } catch (e) {
      if (!(e instanceof UnsetPhraseError)) {
        console.warn(e);
      }
      translation[lang] = `⚠ ${e}`;
    }
  });
  console.timeEnd("translateAll");
  return translation;

  function translateGerman(translation: IntlText): IntlText {
    const mapping = {
      ausser: "außer",
      Ausser: "Außer",
      reissen: "reißen",
      Reissen: "Reißen",
      mitreiss: "mitreiß",
      Mitreiss: "Mitreiß",
      gross: "groß",
      Gross: "Groß",
      grösse: "größe",
      Grösse: "Größe",
      mässig: "mäßig",
      Mässig: "Mäßig",
      massnahmen: "maßnahmen",
      Massnahmen: "Maßnahmen",
      strassen: "straßen",
      Strassen: "Straßen",
      stossen: "stoßen",
      Stossen: "Stoßen",
      fuss: "fuß",
      Fuss: "Fuß",
      füsse: "füße",
      Füsse: "Füße"
    };
    const re = new RegExp(Object.keys(mapping).join("|"), "gi");
    return translation.replace(re, s => mapping[s as keyof typeof mapping]);
  }
}
