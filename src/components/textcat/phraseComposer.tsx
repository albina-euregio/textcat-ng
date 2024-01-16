import { ComponentChildren, FunctionalComponent } from "preact";
import { useContext, useMemo, useState } from "preact/hooks";
import { CatalogContext } from "./contexts";
import {
  CurlyNameSuffix,
  FULL_STOP,
  WrittenPhrase,
  WrittenTextProps,
  mapLineFragment,
  newPhrase,
  withJokerText,
  withLine,
  withPhrase,
  isPhrase,
  isJoker,
  LANGUAGES,
  Phrase,
  DEEPL_LANGUAGES,
  translateJoker
} from "../../model";
import TextHighlighter from "./textHighlighter";
import BracesAsterisk from "../bootstrap-icons/braces-asterisk";
import { t } from "../../i18n";

interface Props extends WrittenTextProps {
  children?: ComponentChildren;
  curlyNameSuffix: CurlyNameSuffix;
  searchWords?: string[];
  srcRegion: string;
  showError?: boolean;
  onDragStart?: (event: DragEvent) => void;
  onDrop?: (event: DragEvent) => void;
}

const PhraseComposer: FunctionalComponent<Props> = (props: Props) => {
  const catalog = useContext(CatalogContext);
  const phrase = catalog.phrase(
    props.writtenPhrase.curlyName + props.curlyNameSuffix
  );

  const summary = useMemo(
    (): string =>
      catalog.previewPhrase(
        props.writtenPhrase,
        props.curlyNameSuffix,
        props.showError
      ),

    [catalog, props.writtenPhrase, props.curlyNameSuffix, props.showError]
  );

  const isDraggable = !!props.onDragStart;
  const [isDragOver, setDragOver] = useState(false);

  if (!isJoker(props.writtenPhrase) && !phrase) return <></>;

  return (
    <details
      open={isPhrase(phrase) || isJoker(props.writtenPhrase)}
      class={isDragOver ? "block dragover" : "block"}
    >
      <summary
        draggable={isDraggable}
        onDragStart={props.onDragStart}
        onDragEnter={() => setDragOver(true)}
        onDragLeave={() => setDragOver(false)}
        onDragOver={event => event.preventDefault()}
        onDrop={event => {
          setDragOver(false);
          props.onDrop?.(event);
        }}
      >
        {props.children}
        {isJoker(props.writtenPhrase) && (
          <abbr title={t("sentence.joker")}>
            <BracesAsterisk />
          </abbr>
        )}
        <TextHighlighter text={summary} searchWords={props.searchWords} />
      </summary>
      {isJoker(props.writtenPhrase) ? (
        <JokerComposer {...props} />
      ) : (
        phrase && <PhraseTable {...props} phrase={phrase} />
      )}
    </details>
  );
};

export default PhraseComposer;

const JokerComposer: FunctionalComponent<WrittenTextProps> = ({
  writtenPhrase,
  setWrittenPhrase
}: WrittenTextProps) => {
  if (!isJoker(writtenPhrase)) throw new Error();
  return (
    <table class={"joker"}>
      {LANGUAGES.map(lang => (
        <tr key={lang}>
          <th>{lang}</th>
          <td>
            <input
              type="text"
              lang={lang}
              spellCheck={true}
              value={writtenPhrase.args[lang]}
              onChange={e => {
                setWrittenPhrase(
                  withJokerText(
                    writtenPhrase,
                    lang,
                    (e.target as HTMLInputElement).value
                  )
                );
              }}
            ></input>
          </td>
          <td>
            {DEEPL_LANGUAGES.includes(lang) && (
              <button
                disabled={!writtenPhrase.args[lang]}
                onClick={async () =>
                  setWrittenPhrase(await translateJoker(writtenPhrase, lang))
                }
              >
                DeepL
              </button>
            )}
          </td>
        </tr>
      ))}
    </table>
  );
};

type SelectLineProps = Props & { phrase: Phrase };

const SelectLine: FunctionalComponent<SelectLineProps> = ({
  phrase,
  searchWords,
  setWrittenPhrase,
  srcRegion,
  writtenPhrase
}: SelectLineProps) => {
  const catalog = useContext(CatalogContext);
  const line = phrase.lines.length === 1 ? 0 : writtenPhrase.line;
  const isRegionVisible = (region?: string): boolean =>
    !region || !srcRegion || srcRegion === region;

  return (
    <tr>
      <td colSpan={99}>
        <select
          size={line >= 0 ? 1 : phrase.lines.length + 1}
          disabled={phrase.lines.length === 1}
          value={line}
          onChange={(e): void => {
            const line = +(e.target as HTMLSelectElement).value;
            setWrittenPhrase(withLine(writtenPhrase, line));
          }}
        >
          <option value={-1}></option>
          {phrase.lines.map((line, lineIndex) => (
            <option
              key={line}
              value={lineIndex}
              class={isRegionVisible(line.region) ? undefined : "d-none"}
            >
              <TextHighlighter
                text={catalog.translateLineFragments(line.lineFragments)}
                searchWords={searchWords}
              />
            </option>
          ))}
        </select>
      </td>
    </tr>
  );
};

const SelectedLine: FunctionalComponent<SelectLineProps> = ({
  phrase,
  searchWords,
  setWrittenPhrase,
  srcRegion,
  writtenPhrase
}: SelectLineProps) => {
  const line = phrase.lines.length === 1 ? 0 : writtenPhrase.line;
  const selectedLine = phrase.lines[line];
  if (isJoker(writtenPhrase)) throw new Error();
  return (
    <tr>
      {selectedLine?.lineFragments
        ?.filter(lineFragment => lineFragment !== FULL_STOP)
        ?.map((lineFragment, index) =>
          mapLineFragment(
            lineFragment,
            (curlyName, curlyNameSuffix) => (
              <td key={index}>
                <PhraseComposer
                  curlyNameSuffix={curlyNameSuffix}
                  srcRegion={srcRegion}
                  searchWords={searchWords}
                  writtenPhrase={
                    writtenPhrase?.args?.[curlyName] ?? newPhrase(curlyName)
                  }
                  setWrittenPhrase={(newPhrase: WrittenPhrase): void =>
                    setWrittenPhrase(withPhrase(writtenPhrase, newPhrase))
                  }
                />
              </td>
            ),
            () => undefined
          )
        )}
    </tr>
  );
};

const PhraseTable: FunctionalComponent<SelectLineProps> = (
  props: SelectLineProps
) => {
  return (
    <table>
      {isPhrase(props.phrase) && <SelectLine {...props} />}
      {props.phrase && <SelectedLine {...props} />}
    </table>
  );
};
