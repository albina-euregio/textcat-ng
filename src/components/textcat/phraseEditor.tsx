import { FunctionalComponent } from "preact";
import { useMemo, useState } from "preact/hooks";
import { AllTextCatalogues, Lang, Phrase, newPhraseLine } from "../../model";

interface Props {
  catalogs: AllTextCatalogues;
  phrases: Phrase[];
  onPhraseChange(lang: Lang, phrase: Phrase): void;
}

const PhraseEditor: FunctionalComponent<Props> = ({
  catalogs,
  phrases,
  onPhraseChange
}: Props) => {
  const [curlyName, setCurlyName] = useState("");
  const phraseLangs = useMemo(
    () =>
      Object.values(catalogs.catalogs).map(c => ({
        lang: c.lang,
        phrase: c.phrase(curlyName)
      })),
    [catalogs.catalogs, curlyName]
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
          {phrases.map(phrase => (
            <option key={phrase.curlyName} value={phrase.curlyName}>
              {phrase.curlyName}
            </option>
          ))}
        </select>
      </label>
      <table style={{ width: "100%" }}>
        <tr>
          {phraseLangs.map(({ lang }) => (
            <th key={lang} style={{ width: `${100 / phraseLangs.length}%` }}>
              {lang}
            </th>
          ))}
        </tr>
        {phraseLangs[0].phrase?.lines.map((_, index) => (
          <tr key={index}>
            {phraseLangs.map(({ lang, phrase }) => {
              if (!phrase) return;
              const line = phrase.lines[index];
              return (
                <td key={lang}>
                  <input
                    style={{ width: "100%" }}
                    type="text"
                    value={line.line}
                    onInput={e => {
                      phrase.lines[index] = newPhraseLine(
                        (e.target as HTMLInputElement).value,
                        line.region
                      );
                      onPhraseChange(lang, phrase);
                    }}
                  />
                </td>
              );
            })}
          </tr>
        ))}
      </table>
    </div>
  );
};

export default PhraseEditor;
