import { FunctionalComponent } from "preact";
import { useMemo, useState } from "preact/hooks";
import { AllTextCatalogues, Lang, Sentence, newPhraseLine } from "../../model";
import PlusSquare from "../bootstrap-icons/plus-square";

interface Props {
  catalogs: AllTextCatalogues;
  sentences: Sentence[];
  onSentenceChange(lang: Lang, sentence: Sentence): void;
}

const SentenceEditor: FunctionalComponent<Props> = ({
  catalogs,
  sentences,
  onSentenceChange
}: Props) => {
  const [curlyName, setCurlyName] = useState("");
  const sentenceLangs = useMemo(
    () =>
      Object.values(catalogs.catalogs).map(c => ({
        lang: c.lang,
        phrase: c.sentence(curlyName)
      })),
    [catalogs.catalogs, curlyName]
  );
  return (
    <div class="block" style="max-height: 30vh; overflow-y: scroll">
      <h2>
        Sentence editor{" "}
        <small>
          <button
            onClick={(): void => {
              const curlyName = prompt("curlyName");
              if (!curlyName) return;
              sentenceLangs.forEach(({ lang }) =>
                onSentenceChange(lang, {
                  $type: "Sentence",
                  header: curlyName,
                  curlyName,
                  lines: [
                    {
                      line: "",
                      lineFragments: []
                    }
                  ]
                })
              );
            }}
          >
            <PlusSquare />
          </button>
        </small>
      </h2>
      <label class="d-flex mt-10">
        <select
          class="f-auto f-truncate"
          value={curlyName}
          onChange={(e): void =>
            setCurlyName((e.target as HTMLSelectElement).value)
          }
        >
          {sentences.map(phrase => (
            <option key={phrase.curlyName} value={phrase.curlyName}>
              {phrase.curlyName}
            </option>
          ))}
        </select>
      </label>
      {sentenceLangs.some(({ phrase }) => phrase) && (
        <table style={{ width: "100%" }}>
          {sentenceLangs.map(({ lang, phrase }) => (
            <tr key={lang}>
              <td>
                {phrase && (
                  <input
                    style={{ width: "100%" }}
                    type="text"
                    value={phrase.header}
                    onInput={e => {
                      phrase.header = (e.target as HTMLInputElement).value;
                      onSentenceChange(lang, phrase);
                    }}
                  />
                )}
              </td>
              <th class="pr-10" style={{ width: 0 }}>
                {lang}
              </th>
              <td>
                {phrase && (
                  <input
                    style={{ width: "100%" }}
                    type="text"
                    value={phrase.lines[0].line}
                    onInput={e => {
                      phrase.lines[0] = newPhraseLine(
                        (e.target as HTMLInputElement).value
                      );
                      onSentenceChange(lang, phrase);
                    }}
                  />
                )}
              </td>
            </tr>
          ))}
        </table>
      )}
    </div>
  );
};

export default SentenceEditor;
