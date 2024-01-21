import { FunctionalComponent } from "preact";
import { useMemo, useState } from "preact/hooks";
import {
  AllTextCatalogues,
  Lang,
  Phrase,
  SECOND_ITEM_PART_NO_SUFFIX,
  newPhraseLine
} from "../../model";
import PlusSquare from "../bootstrap-icons/plus-square";

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
        phrase: c.phrase(curlyName),
        phraseNO: c.phrase(curlyName + SECOND_ITEM_PART_NO_SUFFIX)
      })),
    [catalogs.catalogs, curlyName]
  );
  const usages = useMemo(
    () =>
      [
        ...catalogs.catalogs.de.sentences,
        ...catalogs.catalogs.de.phrases
      ].filter(phrase =>
        phrase.lines.some(
          l => l.lineFragments?.some(f => f === "{" + curlyName + "}")
        )
      ),
    [catalogs.catalogs.de.phrases, catalogs.catalogs.de.sentences, curlyName]
  );
  return (
    <div class="block" style="max-height: 30vh; overflow-y: scroll">
      <h2>
        Phrase editor{" "}
        <small>
          <button
            onClick={(): void => {
              const curlyName = prompt("curlyName");
              if (!curlyName) return;
              phraseLangs.forEach(({ lang }) =>
                onPhraseChange(lang, {
                  $type: "Phrase",
                  header: curlyName,
                  curlyName,
                  lines: []
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
          {phrases.map(phrase => (
            <option key={phrase.curlyName} value={phrase.curlyName}>
              {phrase.curlyName}
            </option>
          ))}
        </select>
      </label>
      <label class="d-flex">
        Used in: {usages.map(p => p.curlyName).join(", ")}
      </label>
      <table style={{ width: "100%" }}>
        <tr>
          {phraseLangs.map(({ lang, phrase }) => (
            <td key={lang}>
              {phrase && (
                <input
                  lang={lang}
                  spellCheck={true}
                  style={{ width: "100%" }}
                  type="text"
                  value={phrase.header}
                  onInput={e => {
                    phrase.header = (e.target as HTMLInputElement).value;
                    onPhraseChange(lang, phrase);
                  }}
                />
              )}
            </td>
          ))}
        </tr>
        <tr>
          {phraseLangs.map(({ lang }) => (
            <th key={lang} style={{ width: `${100 / phraseLangs.length}%` }}>
              {lang}
            </th>
          ))}
        </tr>
        {phraseLangs[0].phrase?.lines.map((_, index) => (
          <tr key={index}>
            {phraseLangs.map(({ lang, phrase, phraseNO }) => (
              <td key={lang}>
                {[phrase, phraseNO].filter(Boolean).map((phrase, i, array) => {
                  if (!phrase?.lines.length) return;
                  return (
                    <input
                      key={i}
                      lang={lang}
                      spellCheck={true}
                      style={{ width: `${100 / array.length}%` }}
                      type="text"
                      value={phrase.lines[index].line}
                      onInput={e => {
                        phrase.lines[index] = newPhraseLine(
                          (e.target as HTMLInputElement).value,
                          phrase.lines[index].region
                        );
                        onPhraseChange(lang, phrase);
                      }}
                    />
                  );
                })}
              </td>
            ))}
          </tr>
        ))}
      </table>
    </div>
  );
};

export default PhraseEditor;
