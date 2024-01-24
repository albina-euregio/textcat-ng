import { FunctionalComponent } from "preact";
import { useMemo } from "preact/hooks";
import { AllTextCatalogues, Lang, Sentence, newPhraseLine } from "../../model";
import PlusSquare from "../bootstrap-icons/plus-square";

interface Props {
  catalogs: AllTextCatalogues;
  sentences: Sentence[];
  sentenceCurlyName: string;
  setPhraseCurlyName(curlyName: string): void;
  setSentenceCurlyName(curlyName: string): void;
  onSentenceChange(lang: Lang, sentence: Sentence): void;
}

const SentenceEditor: FunctionalComponent<Props> = ({
  catalogs,
  sentences,
  sentenceCurlyName,
  setPhraseCurlyName,
  setSentenceCurlyName,
  onSentenceChange
}: Props) => {
  const sentenceLangs = useMemo(
    () =>
      Object.values(catalogs.catalogs).map(c => ({
        lang: c.lang,
        phrase: c.sentence(sentenceCurlyName)
      })),
    [catalogs.catalogs, sentenceCurlyName]
  );
  const usages = useMemo(
    () =>
      (sentenceLangs[0].phrase?.lines[0].lineFragments ?? []).map(f => ({
        curlyName: f.slice(1, -1)
      })),
    [sentenceLangs]
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
          value={sentenceCurlyName}
          onChange={(e): void =>
            setSentenceCurlyName((e.target as HTMLSelectElement).value)
          }
        >
          <option value=""></option>
          {sentences.map(phrase => (
            <option key={phrase.curlyName} value={phrase.curlyName}>
              {phrase.curlyName}
            </option>
          ))}
        </select>
      </label>
      <label class="d-flex">
        <span class="pr-10">Phrases:</span>
        <ul class="inline">
          {usages.map(p => (
            <li
              key={p.curlyName}
              onClick={() => setPhraseCurlyName(p.curlyName)}
              style={{ cursor: "pointer" }}
            >
              {p.curlyName}
            </li>
          ))}
        </ul>
      </label>
      {sentenceLangs.some(({ phrase }) => phrase) && (
        <table style={{ width: "100%" }}>
          {sentenceLangs.map(({ lang, phrase }) => (
            <tr key={lang}>
              <td>
                {phrase && (
                  <input
                    style={{
                      width: "100%",
                      minWidth: `${phrase.header.length}ex`
                    }}
                    type="text"
                    value={phrase.header}
                    onChange={e => {
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
                    style={{
                      width: "100%",
                      minWidth: `${phrase.lines[0].line.length}ex`
                    }}
                    type="text"
                    value={phrase.lines[0].line}
                    onChange={e => {
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
