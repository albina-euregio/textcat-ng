import { FunctionalComponent } from "preact";
import { useContext, useMemo } from "preact/hooks";
import {
  AllTextCatalogues,
  REMOVE_ME_HEADER,
  Lang,
  Phrase,
  SECOND_ITEM_PART_NO_SUFFIX,
  arrayMove,
  isSentence,
  newPhraseLine
} from "../../model";
import PlusSquare from "../bootstrap-icons/plus-square";
import CaretUpSquare from "../bootstrap-icons/caret-up-square";
import XSquare from "../bootstrap-icons/x-square";
import CaretDownSquare from "../bootstrap-icons/caret-down-square";
import TerminalSplit from "../bootstrap-icons/terminal-split";
import InputCursorText from "../bootstrap-icons/input-cursor-text";
import { I18nContext } from "./contexts";

interface Props {
  catalogs: AllTextCatalogues;
  phrases: Phrase[];
  phraseCurlyName: string;

  setPhraseCurlyName(curlyName: string): void;

  setSentenceCurlyName(curlyName: string): void;

  onPhraseChange(lang: Lang, phrase: Phrase): void;
}

const PhraseEditor: FunctionalComponent<Props> = ({
  catalogs,
  phrases,
  phraseCurlyName,
  setPhraseCurlyName,
  setSentenceCurlyName,
  onPhraseChange
}: Props) => {
  const t = useContext(I18nContext);
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
        phrase.lines.some(l =>
          l.lineFragments?.some(f => f === "{" + phraseCurlyName + "}")
        )
      ),
    [
      catalogs.catalogs.de.phrases,
      catalogs.catalogs.de.sentences,
      phraseCurlyName
    ]
  );

  function removePhrase() {
    const message = t("editor.phrase.remove", phraseCurlyName);
    const ok = confirm(message);
    if (!ok) return;
    phraseLangs.forEach(({ lang, phrase }) => {
      if (!phrase) return;
      phrase.header = REMOVE_ME_HEADER;
      onPhraseChange(lang, phrase);
    });
  }

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

  function renamePhrase() {
    const curlyName = prompt("curlyName", phraseCurlyName);
    if (!curlyName || curlyName === phraseCurlyName) return;
    phraseLangs.forEach(({ lang, phrase }) => {
      if (!phrase) return;
      const header = phrase.header;
      // removePhrase
      phrase.header = REMOVE_ME_HEADER;
      onPhraseChange(lang, phrase);
      // addPhrase
      phrase.header = header;
      phrase.curlyName = curlyName;
      onPhraseChange(lang, phrase);
    });
    setPhraseCurlyName(curlyName);
  }

  function addPhraseLine() {
    const lines = prompt("lines (separated by semicolon)");
    if (!lines) return;
    phraseLangs.forEach(({ lang, phrase, phraseNO }) => {
      if (!phrase) return;
      lines.split(";").forEach(line => {
        phrase.lines.push(newPhraseLine(line.trim()));
        phraseNO?.lines.push(newPhraseLine(line.trim()));
      });
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

  function togglePhraseNO(
    lang: Lang,
    phrase: Phrase,
    phraseNO: Phrase | undefined
  ) {
    const curlyName = phrase.curlyName + SECOND_ITEM_PART_NO_SUFFIX;
    const message = hasPhraseLines(phraseNO)
      ? t("editor.phrase.remove", `${curlyName} (${lang})`)
      : t("editor.phrase.add", `${curlyName} (${lang})`);
    if (!confirm(message)) return;
    onPhraseChange(lang, {
      $type: "Phrase",
      header: phrase.header,
      curlyName,
      lines: hasPhraseLines(phraseNO)
        ? []
        : phrase.lines.map(l => newPhraseLine(l.line, l.region))
    });
  }

  function hasPhraseLines(phrase: Phrase | undefined): phrase is Phrase {
    return (phrase?.lines.length ?? 0) > 0;
  }

  return (
    <div class="block" style="max-height: 30vh; overflow-y: scroll">
      <h2>
        {t("editor.phrase")}{" "}
        <small>
          <button
            onClick={(): void => addPhrase()}
            title={t("editor.phrase.add", "")}
          >
            <PlusSquare />
          </button>
          <button
            onClick={(): void => renamePhrase()}
            disabled={!phraseCurlyName}
            title={t("editor.phrase.rename", phraseCurlyName || "")}
          >
            <InputCursorText />
          </button>
          <button
            onClick={(): void => removePhrase()}
            disabled={!phraseCurlyName}
            title={t("editor.phrase.remove", phraseCurlyName || "")}
          >
            <XSquare />
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
          <span class="pr-10">{t("editor.used-in")}:</span>
          <ul class="inline">
            {usages.map(p => (
              <li
                key={p.curlyName}
                onClick={() =>
                  isSentence(p)
                    ? setSentenceCurlyName(p.curlyName)
                    : setPhraseCurlyName(p.curlyName)
                }
                style={{ cursor: "pointer" }}
              >
                {p.curlyName}
              </li>
            ))}
          </ul>
        </label>
      )}
      {phraseLangs.some(({ phrase }) => phrase) && (
        <table style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td></td>
              {phraseLangs.map(({ lang, phrase }) => (
                <td key={lang}>
                  {phrase && (
                    <input
                      lang={lang}
                      spellcheck={true}
                      style={{
                        width: "100%",
                        minWidth: `${phrase.header.length}ex`
                      }}
                      type="text"
                      value={phrase.header}
                      onChange={e => {
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
              {phraseLangs.map(({ lang, phrase, phraseNO }) => (
                <th key={lang}>
                  {lang}{" "}
                  <small>
                    <button
                      onClick={(): void => addPhraseLine()}
                      title={t("editor.phrase-line.add")}
                    >
                      <PlusSquare />
                    </button>
                    {phrase && (
                      <button
                        onClick={() => togglePhraseNO(lang, phrase, phraseNO)}
                        title={t("editor.phrase.toggle-split")}
                      >
                        <TerminalSplit />
                      </button>
                    )}
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
                      title={t("editor.phrase-line.moveUp")}
                    >
                      <CaretUpSquare />
                    </button>
                    <button
                      onClick={(): void => {
                        const message = t(
                          "editor.phrase-line.remove",
                          index + 1
                        );
                        if (!confirm(message)) return;
                        movePhraseLine(index, undefined);
                      }}
                      title={t("editor.phrase-line.remove", index + 1)}
                    >
                      <XSquare />
                    </button>
                    <button
                      disabled={index >= array.length - 1}
                      onClick={(): void => movePhraseLine(index, index + 1)}
                      title={t("editor.phrase-line.moveDown")}
                    >
                      <CaretDownSquare />
                    </button>
                  </small>
                </td>
                {phraseLangs.map(({ lang, phrase, phraseNO }) => (
                  <td key={lang} style={{ whiteSpace: "nowrap" }}>
                    {[phrase, phraseNO]
                      .filter(hasPhraseLines)
                      .map((phrase, i, array) => (
                        <input
                          key={i}
                          lang={lang}
                          spellcheck={true}
                          style={{
                            width: `${100 / array.length}%`,
                            minWidth: `${phrase.lines[index].line.length}ex`
                          }}
                          type="text"
                          value={phrase.lines[index].line}
                          onChange={e => {
                            phrase.lines[index] = newPhraseLine(
                              (e.target as HTMLInputElement).value,
                              phrase.lines[index].region
                            );
                            onPhraseChange(lang, phrase);
                          }}
                        />
                      ))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PhraseEditor;
