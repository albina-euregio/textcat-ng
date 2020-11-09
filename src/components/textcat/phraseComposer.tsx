import { ComponentChildren, FunctionalComponent, h } from "preact";
import { useContext } from "preact/hooks";
import { CatalogContext } from "./contexts";
import {
  WrittenText,
  WrittenTextProps,
  mapLineFragment,
  newPhrase,
  withLine,
  withPhrase
} from "../../model";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props extends WrittenTextProps {
  children?: ComponentChildren;
  curlyNameSuffix?: "_NO";
}

const PhraseComposer: FunctionalComponent<Props> = (props: Props) => {
  const catalog = useContext(CatalogContext);
  const phrase = catalog.phrase(
    props.writtenText.curlyName + (props.curlyNameSuffix ?? "")
  );
  if (!phrase) return <div></div>;

  const line = phrase.lines.length === 1 ? 0 : props.writtenText.line;
  const selectedLineFragments = phrase.lines[line]?.lineFragments;
  const selectedLineTd = selectedLineFragments?.map((lineFragment, index) =>
    mapLineFragment(
      lineFragment,
      (curlyName, curlyNameSuffix) => (
        <td key={index}>
          <PhraseComposer
            curlyNameSuffix={curlyNameSuffix}
            writtenText={
              props.writtenText?.args?.[curlyName] ?? newPhrase(curlyName)
            }
            setWrittenText={(newPhrase: WrittenText): void =>
              props.setWrittenText(withPhrase(props.writtenText, newPhrase))
            }
          />
        </td>
      ),
      () => undefined
    )
  );

  const select = (
    <select
      size={line >= 0 ? 1 : phrase.lines.length + 1}
      disabled={phrase.lines.length === 1}
      value={line}
      onChange={(e): void => {
        const line = +(e.target as HTMLSelectElement).value;
        props.setWrittenText(withLine(props.writtenText, line));
      }}
    >
      <option value={-1}></option>
      {phrase.lines.map((line, lineIndex) => (
        <option key={line} value={lineIndex}>
          {line.line}
        </option>
      ))}
    </select>
  );

  return (
    <table class="block">
      <caption>
        {"{" + phrase.header + "}"}
        {props.children}
      </caption>
      {phrase.$type === "Phrase" && (
        <tr>
          <td colSpan={99}>{select}</td>
        </tr>
      )}
      <tr>{selectedLineTd}</tr>
    </table>
  );
};

export default PhraseComposer;
