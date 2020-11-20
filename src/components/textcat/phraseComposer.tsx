import { ComponentChildren, FunctionalComponent, h } from "preact";
import { useContext } from "preact/hooks";
import { CatalogContext } from "./contexts";
import {
  CurlyNameSuffix,
  FULL_STOP,
  WrittenPhrase,
  WrittenTextProps,
  mapLineFragment,
  newPhrase,
  withLine,
  withPhrase
} from "../../model";

interface Props extends WrittenTextProps {
  children?: ComponentChildren;
  curlyNameSuffix: CurlyNameSuffix;
  srcRegion: string;
}

const PhraseComposer: FunctionalComponent<Props> = (props: Props) => {
  const catalog = useContext(CatalogContext);
  const phrase = catalog.phrase(
    props.writtenPhrase.curlyName + props.curlyNameSuffix
  );
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
      class="max-width-12"
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
          {catalog.translateLineFragments(line.lineFragments)}
        </option>
      ))}
    </select>
  );

  let summary = "{" + phrase.header + "}";
  try {
    summary = catalog.translate([props.writtenPhrase]);
  } catch (e) {
    // ignore error
  }

  return (
    <details open={true} class="block">
      <summary>
        {summary}
        {props.children}
      </summary>
      <table>
        {phrase.$type === "Phrase" && (
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
