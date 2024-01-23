import { FunctionalComponent } from "preact";
import { useMemo } from "preact/hooks";
import {
  AllTextCatalogues,
  Lang,
  Phrase,
  SECOND_ITEM_PART_NO_SUFFIX,
  arrayMove,
  isPhrase,
  newPhraseLine
} from "../../model";
import PlusSquare from "../bootstrap-icons/plus-square";
import CaretUpSquare from "../bootstrap-icons/caret-up-square";
import XSquare from "../bootstrap-icons/x-square";
import CaretDownSquare from "../bootstrap-icons/caret-down-square";

interface Props {
  catalogs: AllTextCatalogues;
  phrases: Phrase[];
  phraseCurlyName: string;
  setPhraseCurlyName(curlyName: string): void;
  onPhraseChange(lang: Lang, phrase: Phrase): void;
}

const PhraseEditor: FunctionalComponent<Props> = ({
  catalogs,
  phrases,
  phraseCurlyName,
  setPhraseCurlyName,
  onPhraseChange
}: Props) => {
  const phraseLangs = useMemo(
    () =>
      Object.values(catalogs.catalogs).map(c => ({
        lang: c.lang,
        phrase: c.phrase(phraseCurlyName),
        phraseNO: c.phrase(phraseCurlyName + SECOND_ITEM_PART_NO_SUFFIX)
      })),
    [catalogs.catalogs, phraseCurlyName]
  );
  const usages = useMemo(
    () =>
      [
        ...catalogs.catalogs.de.sentences,
        ...catalogs.catalogs.de.phrases
      ].filter(phrase =>
        phrase.lines.some(
          l => l.lineFragments?.some(f => f === "{" + phraseCurlyName + "}")
        )
      ),
    [
      catalogs.catalogs.de.phrases,
      catalogs.catalogs.de.sentences,
      phraseCurlyName
    ]
  );

  function addPhrase() {
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
  }

  function addPhraseLine() {
    const line = prompt("line");
    if (!line) return;
    phraseLangs.forEach(({ lang, phrase }) => {
      if (!phrase) return;
      phrase.lines.push(newPhraseLine(line));
      onPhraseChange(lang, phrase);
    });
  }

  function movePhraseLine(fromIndex: number, toIndex?: number) {
    phraseLangs.forEach(({ phrase, phraseNO, lang }) => {
      if (phrase) {
        phrase.lines = arrayMove(phrase.lines, fromIndex, toIndex);
        onPhraseChange(lang, phrase);
      }
      if (phraseNO) {
        phraseNO.lines = arrayMove(phraseNO.lines, fromIndex, toIndex);
        onPhraseChange(lang, phraseNO);
      }
    });
  }

  return (
    <div class="block" style="max-height: 30vh; overflow-y: scroll">
      <h2>
        Phrase editor{" "}
        <small>
          <button onClick={(): void => addPhrase()}>
            <PlusSquare />
          </button>
        </small>
      </h2>
      <label class="d-flex mt-10">
        <select
          class="f-auto f-truncate"
          value={phraseCurlyName}
          onChange={(e): void =>
            setPhraseCurlyName((e.target as HTMLSelectElement).value)
          }
        >
          <option value=""></option>
          {phrases.map(phrase => (
            <option key={phrase.curlyName} value={phrase.curlyName}>
              {phrase.curlyName}
            </option>
          ))}
        </select>
      </label>
      {usages.length > 0 && (
        <label class="d-flex">
          <span class="pr-10">Used in:</span>
          <ul class="inline">
            {usages.map(p => (
              <li
                key={p.curlyName}
                onClick={() => isPhrase(p) && setPhraseCurlyName(p.curlyName)}
                style={{ cursor: isPhrase(p) ? "pointer" : "" }}
              >
                {p.curlyName}
              </li>
            ))}
          </ul>
        </label>
      )}
      {phraseLangs.some(({ phrase }) => phrase) && (
        <table style={{ width: "100%" }}>
          <tr>
            <td></td>
            {phraseLangs.map(({ lang, phrase }) => (
              <td key={lang}>
                {phrase && (
                  <input
                    lang={lang}
                    spellCheck={true}
                    style={{
                      width: "100%",
                      minWidth: `${phrase.header.length}ex`
                    }}
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
            <th>№</th>
            {phraseLangs.map(({ lang }) => (
              <th key={lang}>
                {lang}{" "}
                <small>
                  <button onClick={(): void => addPhraseLine()}>
                    <PlusSquare />
                  </button>
                </small>
              </th>
            ))}
          </tr>
          {phraseLangs[0].phrase?.lines.map((_, index, array) => (
            <tr key={index}>
              <td style={{ whiteSpace: "nowrap" }}>
                {index + 1}{" "}
                <small>
                  <button
                    disabled={index === 0}
                    onClick={(): void => movePhraseLine(index, index - 1)}
                  >
                    <CaretUpSquare />
                  </button>
                  <button
                    onClick={(): void => {
                      if (!confirm(`delete phrase ${index + 1}`)) return;
                      movePhraseLine(index, undefined);
                    }}
                  >
                    <XSquare />
                  </button>
                  <button
                    disabled={index >= array.length - 1}
                    onClick={(): void => movePhraseLine(index, index + 1)}
                  >
                    <CaretDownSquare />
                  </button>
                </small>
              </td>
              {phraseLangs.map(({ lang, phrase, phraseNO }) => (
                <td key={lang}>
                  {[phrase, phraseNO]
                    .filter(Boolean)
                    .map((phrase, i, array) => {
                      if (!phrase?.lines.length) return;
                      return (
                        <input
                          key={i}
                          lang={lang}
                          spellCheck={true}
                          style={{
                            width: `${100 / array.length}%`,
                            minWidth: `${phrase.lines[index].line.length}ex`
                          }}
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
      )}
    </div>
  );
};

export default PhraseEditor;
