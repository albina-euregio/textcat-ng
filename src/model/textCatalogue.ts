import {
  Identifier,
  IntlText,
  isPhrase,
  isSentence,
  Lang,
  CurlyNameSuffix,
  longestCommonPrefix,
  mapLineFragment,
  mergeIntlText,
  newPhrase,
  Phrase,
  Sentence,
  WrittenText
} from ".";
import stopwordsDE from "stopwords-de";

export class TextCatalogue {
  public readonly lang: Lang;
  private data: Record<Identifier, Phrase> = {};
  public sentences: Sentence[] = [];
  public phrases: Phrase[] = [];
  public readonly regions: Set<string> = new Set<string>();
  public readonly wordToPhraseMap: Map<string, Set<string>> = new Map();

  constructor(lang: Lang) {
    this.lang = lang;
  }

  sentence(curlyName: Identifier): Sentence | undefined {
    const sentence = this.data[curlyName];
    return isSentence(sentence) ? sentence : undefined;
  }

  searchSentences(prefix: string): Sentence[] {
    prefix = prefix.toLowerCase();
    return this.sentences.filter(s => this.hasPrefix(s, prefix) === "");
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

  phrase(curlyName: Identifier): Phrase | undefined {
    return this.data[curlyName];
  }

  parse(text: string): this {
    let current: Sentence | Phrase | undefined;
    let currentRegion: string | undefined = undefined;
    text.split(/[\r\n]+/).forEach(line => {
      if (!line) {
        return;
      }
      const [key, value] = line.split(/\s*:\s*/, 2);
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

  buildSearchIndex(): this {
    this.phrases.forEach(phrase =>
      phrase.lines.forEach(({ line }) =>
        line.split(/[\s.,"„“()]+/).forEach(lineFragment =>
          mapLineFragment(
            lineFragment,
            () => undefined,
            word => {
              if (phrase.curlyName.includes("Gebiet")) return;
              if (word === "[Empty]") return;
              if (/^\d+$/.exec(word)) return;
              word = word
                .toLowerCase()
                .replace(/\(-\)/g, "")
                .trim();
              if (!word) return;
              if (this.lang === "de" && stopwordsDE.includes(word)) return;
              const set = this.wordToPhraseMap.get(word) ?? new Set();
              if (!set.size) this.wordToPhraseMap.set(word, set);
              set.add(phrase.curlyName);
            }
          )
        )
      )
    );
    return this;
  }

  translate(writtenTexts: WrittenText[]): IntlText {
    return writtenTexts
      .map(writtenText =>
        this.translatePhrase(writtenText)
          .replace(/\[Empty\] /g, "")
          .replace(/ \[Empty\]/g, "")
          .replace(/\s+\(-\)/g, "")
          .replace(/^[a-z]/, s => s.toLocaleUpperCase(this.lang))
      )
      .reduce(mergeIntlText);
  }

  private translatePhrase(writtenText: WrittenText): IntlText {
    const phrase = this.phrase(writtenText.curlyName);
    if (!phrase) throw new Error(`Unknown phrase ${writtenText.curlyName}!`);
    const line = phrase?.lines[writtenText.line];
    const lineFragments = line?.lineFragments;
    if (!line || !lineFragments)
      throw new Error(
        `Unknown line ${writtenText.line} in phrase ${writtenText.curlyName}!`
      );
    return lineFragments
      .map(lineFragment =>
        mapLineFragment(
          lineFragment,
          (curlyName, curlyNameSuffix) =>
            this.translatePhrase(
              this.getPhrase(writtenText, curlyName, curlyNameSuffix)
            ),
          text => text
        )
      )
      .reduce(mergeIntlText);
  }

  getPhrase(
    writtenText: WrittenText,
    curlyName: Identifier,
    curlyNameSuffix: CurlyNameSuffix
  ): WrittenText {
    // lookup in writtenText
    const phrase = writtenText?.args?.[curlyName];
    if (phrase) {
      return {
        ...phrase,
        curlyName: curlyName + curlyNameSuffix
      };
    }
    // find unique line from catalog
    const fromCatalog = this.phrase(curlyName + curlyNameSuffix);
    if (fromCatalog?.lines.length === 1) {
      return newPhrase(curlyName, 0);
    }
    throw new Error(`Unset phrase ${curlyName} in ${writtenText.curlyName}!`);
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
    console.timeEnd(`parse ${file}`);
  } catch (e) {
    throw new Error(`Failed to build textcat from ${file}: ${e}`);
  }
  return catalog;
}
