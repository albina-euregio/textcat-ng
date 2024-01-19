import { FunctionalComponent } from "preact";
import { useContext, useMemo, useState } from "preact/hooks";
import { CatalogContext } from "./contexts";
import { newPhraseLine } from "../../model";

interface Props {}

const PhraseEditor: FunctionalComponent<Props> = () => {
  const catalog = useContext(CatalogContext);
  const [curlyName, setCurlyName] = useState("");
  const phrase = useMemo(
    () => catalog.phrases.find(p => p.curlyName === curlyName),
    [catalog.phrases, curlyName]
  );
  return (
    <div class="block" style="max-height: 30vh; overflow-y: scroll">
      <label class="d-flex mt-10">
        <select
          class="f-auto f-truncate"
          value={curlyName}
          onChange={(e): void =>
            setCurlyName((e.target as HTMLSelectElement).value)
          }
        >
          {catalog.phrases.map(phrase => (
            <option key={phrase.curlyName} value={phrase.curlyName}>
              {phrase.curlyName}
            </option>
          ))}
        </select>
      </label>
      {phrase?.lines.map((line, index) => (
        <label key={index} class="d-flex">
          <input
            class="f-auto"
            type="text"
            value={line.line}
            onInput={e => {
              catalog.lastModified = new Date().toISOString();
              const lines = [...phrase.lines];
              lines[index] = newPhraseLine(
                (e.target as HTMLInputElement).value,
                line.region
              );
              phrase.lines = lines;
            }}
          />
        </label>
      ))}
    </div>
  );
};

export default PhraseEditor;
