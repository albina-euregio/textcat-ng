type Data = Record<Identifier, Sentence | Phrase>;
export async function buildTextcat(): Promise<Data> {
  // cat DE/Sentences/* DE/Ranges/* > assets/satzkatalog.DE.txt
  const response = await fetch("/assets/satzkatalog.DE.txt");
  const text = await response.text();

  console.time("parse satzkatalog.DE.txt");
  const data: Data = {};
  let currentHeader = "";
  let currentRegion: string | undefined = undefined;
  text.split(/[\r\n]+/).forEach(line => {
    if (!line) {
      return;
    }
    const current = data[currentHeader];
    const [key, value] = line.split(/\s*:\s*/, 2);
    switch (key) {
      case "ST_Header":
        currentHeader = value;
        data[currentHeader] = {
          $type: "Sentence",
          header: { de: value },
          curlyName: "",
          pos: [],
          posGerman: [],
          phrases: []
        };
        break;
      case "ST_CurlyName":
        if (current.$type === "Sentence") {
          current.curlyName = value;
        } else {
          console.warn("Ignoring", line);
        }
        break;
      case "PA_Pos":
        if (current.$type === "Sentence") {
          current.pos?.push(+value);
        } else {
          console.warn("Ignoring", line);
        }
        break;
      case "PA_PosGerman":
        if (current.$type === "Sentence") {
          current.posGerman?.push(+value);
        } else {
          console.warn("Ignoring", line);
        }
        break;
      case "RS_Header":
        currentHeader = value;
        data[currentHeader] = {
          $type: "Phrase",
          header: { de: value },
          curlyName: "",
          lines: []
        };
      case "RS_CurlyName":
        if (current.$type === "Sentence") {
          current.phrases?.push(value);
        } else if (current.$type === "Phrase") {
          current.curlyName = value;
        }
        break;
      case "Line":
        if (current.$type === "Phrase") {
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
  return data;
}
