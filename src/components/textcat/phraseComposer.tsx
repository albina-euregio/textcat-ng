import { ComponentChildren, FunctionalComponent } from "preact";
import { useContext, useMemo } from "preact/hooks";
import { CatalogContext } from "./contexts";
import {
  CurlyNameSuffix,
  FULL_STOP,
  WrittenPhrase,
  WrittenTextProps,
  mapLineFragment,
  newPhrase,
  withLine,
  withPhrase,
  isPhrase,
  isSentence,
  sentencePreview
} from "../../model";
import TextHighlighter from "./textHighlighter";

interface Props extends WrittenTextProps {
  children?: ComponentChildren;
  curlyNameSuffix: CurlyNameSuffix;
  searchWords?: string[];
  srcRegion: string;
}

const PhraseComposer: FunctionalComponent<Props> = (props: Props) => {
  const catalog = useContext(CatalogContext);
  const phrase = catalog.phrase(
    props.writtenPhrase.curlyName + props.curlyNameSuffix
  );

  const summary = useMemo((): string => {
    if (!phrase) return "";
    try {
      const translation = catalog.translatePhrase(
        props.writtenPhrase,
        props.curlyNameSuffix
      );
      return isSentence(phrase)
        ? sentencePreview(phrase, catalog, translation)
        : translation;
    } catch (e) {
      return isSentence(phrase)
        ? sentencePreview(phrase, catalog)
        : `{${phrase.header}}: ⚠ ${e}`;
    }
  }, [catalog, phrase, props.writtenPhrase, props.curlyNameSuffix]);

  if (!phrase) return <div></div>;

  const line = phrase.lines.length === 1 ? 0 : props.writtenPhrase.line;
  const selectedLine = phrase.lines[line];
  const selectedLineFragments = selectedLine?.lineFragments?.filter(
    lineFragment => lineFragment !== FULL_STOP
  );
  const selectedLineTd = selectedLineFragments?.map((lineFragment, index) =>
    mapLineFragment(
      lineFragment,
      (curlyName, curlyNameSuffix) => (
        <td key={index}>
          <PhraseComposer
            curlyNameSuffix={curlyNameSuffix}
            srcRegion={props.srcRegion}
            searchWords={props.searchWords}
            writtenPhrase={
              props.writtenPhrase?.args?.[curlyName] ?? newPhrase(curlyName)
            }
            setWrittenPhrase={(newPhrase: WrittenPhrase): void =>
              props.setWrittenPhrase(withPhrase(props.writtenPhrase, newPhrase))
            }
          />
        </td>
      ),
      () => undefined
    )
  );

  const isRegionVisible = (region?: string): boolean =>
    !region || !props.srcRegion || props.srcRegion === region;
  const select = (
    <select
      size={line >= 0 ? 1 : phrase.lines.length + 1}
      disabled={phrase.lines.length === 1}
      value={line}
      onChange={(e): void => {
        const line = +(e.target as HTMLSelectElement).value;
        props.setWrittenPhrase(withLine(props.writtenPhrase, line));
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
            searchWords={props.searchWords}
          />
        </option>
      ))}
    </select>
  );

  return (
    <details open={isPhrase(phrase)} class="block">
      <summary>
        {props.children}
        <TextHighlighter text={summary} searchWords={props.searchWords} />
      </summary>
      <table>
        {isPhrase(phrase) && (
          <tr>
            <td colSpan={99}>{select}</td>
          </tr>
        )}
        <tr>{selectedLineTd}</tr>
      </table>
    </details>
  );
};

export default PhraseComposer;
