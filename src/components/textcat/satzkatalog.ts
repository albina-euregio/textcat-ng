type Data = Record<Identifier, Sentence | Phrase>;
export async function buildTextcat(): Promise<TextcatCatalog> {
  // awk '{print $0}' DE/Sentences/* DE/Ranges/* > assets/satzkatalog.DE.txt
  const response = await fetch("/assets/satzkatalog.DE.txt");
  const text = await response.text();

  console.time("parse satzkatalog.DE.txt");
  const data: Data = {};
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
          header: { de: value },
          curlyName: "",
          pos: [],
          posGerman: [],
          phrases: []
        };
        break;
      case "ST_CurlyName":
        if (current?.$type === "Sentence") {
          current.curlyName = value;
          data[current.curlyName] = current;
        } else {
          console.warn("Ignoring", line);
        }
        break;
      case "PA_Pos":
        if (current?.$type === "Sentence") {
          current.pos?.push(+value);
        } else {
          console.warn("Ignoring", line);
        }
        break;
      case "PA_PosGerman":
        if (current?.$type === "Sentence") {
          current.posGerman?.push(+value);
        } else {
          console.warn("Ignoring", line);
        }
        break;
      case "RS_Header":
        current = {
          $type: "Phrase",
          header: { de: value },
          curlyName: "",
          lines: []
        };
        break;
      case "RS_CurlyName":
        if (current?.$type === "Sentence") {
          current.phrases?.push(value);
        } else if (current?.$type === "Phrase") {
          current.curlyName = value;
          data[current.curlyName] = current;
        }
        break;
      case "Line":
        if (current?.$type === "Phrase") {
          current.lines?.push({ line: { de: value }, region: currentRegion });
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
  console.timeEnd("parse satzkatalog.DE.txt");
  // console.table(Object.values(data));
  return {
    sentence(curlyName: Identifier): Sentence | undefined {
      const sentence = data[curlyName];
      return sentence?.$type === "Sentence" ? sentence : undefined;
    },
    searchSentences(): Sentence[] {
      return [];
    },
    splitPhraseLine(line: string): string[] {
      return line.match(/{[^}]+}|[^{}]+/g) ?? [];
    },
    phrase(curlyName: Identifier): Phrase | undefined {
      const phrase = data[curlyName];
      return phrase?.$type === "Phrase" ? phrase : undefined;
    }
  };
}
