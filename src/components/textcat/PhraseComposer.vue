import { ComponentChildren, FunctionalComponent } from "preact";
import { useCallback, useContext, useMemo, useState } from "preact/hooks";
import { CatalogContext, I18nContext } from "./contexts";
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
  isTranslateJokerEnabled,
  translateJoker,
  CurlyName
} from "../../model";
import TextHighlighter from "./textHighlighter";
import BracesAsterisk from "../bootstrap-icons/braces-asterisk";
import { useTraceUpdate } from "./useTraceUpdate";

export interface Props extends WrittenTextProps {
  children?: ComponentChildren;
  curlyName: CurlyName;
  curlyNameSuffix: CurlyNameSuffix;
  searchWords?: string[];
  srcRegion: string;
  showError?: boolean;
  onDragStart?: (event: DragEvent) => void;
  onDrop?: (event: DragEvent) => void;
  readOnly: boolean;
  writtenPhraseFallback: () => WrittenPhrase;
}

const PhraseComposer: FunctionalComponent<Props> = (props: Props) => {
  useTraceUpdate("PhraseComposer", props);
  const catalog = useContext(CatalogContext);
  const t = useContext(I18nContext);
  const [writtenPhrase] = useState(
    props.writtenPhrase ?? newPhrase(props.curlyName)
  );
  const phrase = catalog.phrase(props.curlyName + props.curlyNameSuffix);

  const summary = useMemo(
    (): string =>
      catalog.previewPhrase(
        writtenPhrase,
        props.curlyNameSuffix,
        props.showError
      ),

    [catalog, writtenPhrase, props.curlyNameSuffix, props.showError]
  );

  const isDraggable = !!props.onDragStart;
  const [isDragOver, setDragOver] = useState(false);

  if (!isJoker(writtenPhrase) && !phrase) return <></>;

  return (
    <details
      open={isPhrase(phrase) || isJoker(writtenPhrase)}
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
        {isJoker(writtenPhrase) && (
          <abbr title={t("sentence.joker")}>
            <BracesAsterisk />
          </abbr>
        )}
        <TextHighlighter text={summary} searchWords={props.searchWords} />
      </summary>
      {props.readOnly ? (
        <></>
      ) : isJoker(writtenPhrase) ? (
        <JokerComposer {...props} />
      ) : (
        phrase && (
          <PhraseTable
            {...props}
            writtenPhrase={writtenPhrase}
            phrase={phrase}
          />
        )
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
      <tbody>
        {LANGUAGES.map(lang => (
          <tr key={lang}>
            <th>{lang}</th>
            <td>
              <input
                type="text"
                lang={lang}
                spellcheck={true} // eslint-disable-line react/no-unknown-property
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
              {isTranslateJokerEnabled() && DEEPL_LANGUAGES.includes(lang) && (
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
      </tbody>
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
  const size =
    line >= 0
      ? 1
      : phrase.lines.filter(line => isRegionVisible(line.region)).length + 1;

  const setWrittenPhrase0 = useCallback(
    (e: Event): void => {
      const line = +(e.target as HTMLSelectElement).value;
      setWrittenPhrase(withLine(writtenPhrase, line));
    },
    [setWrittenPhrase, writtenPhrase]
  );

  return (
    <tr>
      <td colSpan={99}>
        <select
          size={size}
          disabled={phrase.lines.length === 1}
          value={line}
          onChange={setWrittenPhrase0}
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
  readOnly,
  phrase,
  searchWords,
  setWrittenPhrase,
  srcRegion,
  writtenPhrase
}: SelectLineProps) => {
  const line = phrase.lines.length === 1 ? 0 : writtenPhrase.line;
  const selectedLine = phrase.lines[line];
  const setWrittenPhrase0 = useCallback(
    (newPhrase: WrittenPhrase): void =>
      setWrittenPhrase(withPhrase(writtenPhrase, newPhrase)),
    [setWrittenPhrase, writtenPhrase]
  );
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
                  readOnly={readOnly}
                  curlyName={curlyName}
                  curlyNameSuffix={curlyNameSuffix}
                  srcRegion={srcRegion}
                  searchWords={searchWords}
                  writtenPhrase={writtenPhrase?.args?.[curlyName]}
                  setWrittenPhrase={setWrittenPhrase0}
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
      <tbody>
        {isPhrase(props.phrase) && <SelectLine {...props} />}
        {props.phrase && <SelectedLine {...props} />}
      </tbody>
    </table>
  );
};
