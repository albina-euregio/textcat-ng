import {
  Identifier,
  IntlText,
  isPhrase,
  isSentence,
  Lang,
  mapLinePhrase,
  mergeIntlText,
  newPhrase,
  Phrase,
  Sentence,
  WrittenText
} from ".";

export interface TextcatCatalog {
  lang: Lang;
  sentences: Sentence[];
  sentence(curlyName: Identifier): Sentence | undefined;
  searchSentences(search: string): Sentence[];
  phrases: Phrase[];
  phrase(curlyName: Identifier): Phrase | undefined;
  translate(writtenTexts: WrittenText[]): IntlText;
}

export class Satzkatalog implements TextcatCatalog {
  public readonly lang: Lang;
  private data: Record<Identifier, Phrase> = {};
  public sentences: Sentence[] = [];
  public phrases: Phrase[] = [];

  constructor(lang: Lang) {
    this.lang = lang;
  }

  sentence(curlyName: Identifier): Sentence | undefined {
    const sentence = this.data[curlyName];
    return isSentence(sentence) ? sentence : undefined;
  }

  searchSentences(): Sentence[] {
    return [];
  }

  phrase(curlyName: Identifier): Phrase | undefined {
    return this.data[curlyName];
  }

  parse(text: string): void {
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
                linePhrases: []
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
            current.lines[0].linePhrases?.push(`{${value}}`);
          } else if (isPhrase(current)) {
            current.curlyName = value;
            this.data[current.curlyName] = current;
          }
          break;
        case "Line":
          if (isPhrase(current)) {
            current.lines?.push({
              line: value,
              linePhrases: (value.match(/{[^}]+}|[^{}]+/g) ?? [])
                .map(s => s.trim())
                .filter(s => s.length),
              region: currentRegion
            });
          }
          break;
        case "Begin":
          currentRegion = value;
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
    const linePhrases = line?.linePhrases;
    if (!line || !linePhrases)
      throw new Error(
        `Unknown line ${writtenText.line} in phrase ${writtenText.curlyName}!`
      );
    return linePhrases
      .map(linePhrase =>
        mapLinePhrase(
          linePhrase,
          curlyName =>
            this.translatePhrase(this.getPhrase(writtenText, curlyName)),
          text => text
        )
      )
      .reduce(mergeIntlText);
  }

  getPhrase(writtenText: WrittenText, curlyName: Identifier): WrittenText {
    // lookup in writtenText
    const phrase = writtenText?.args?.[curlyName];
    if (phrase) {
      return phrase;
    }
    // find unique line from catalog
    const fromCatalog = this.phrase(curlyName);
    if (fromCatalog?.lines.length === 1) {
      return newPhrase(curlyName, 0);
    }
    throw new Error(`Unset phrase ${curlyName} in ${writtenText.curlyName}!`);
  }
}

export async function buildTextcat(lang: Lang): Promise<TextcatCatalog> {
  // awk '{print $0}' DE/Sentences/* DE/Ranges/* > assets/satzkatalog.DE.txt
  const file = `satzkatalog.${lang.toUpperCase()}.txt`;
  const catalog = new Satzkatalog(lang);
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
