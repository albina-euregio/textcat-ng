import { FunctionalComponent, h } from "preact";
import { useContext } from "preact/hooks";
import { Catalog } from "./catalog";
import * as style from "./style.css";
import {
  WrittenText,
  WrittenTextProps,
  existingOrNewPhrase,
  mapLinePhrase,
  withLine,
  withPhrase
} from "../../model";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props extends WrittenTextProps {}

const TextcatPhrase: FunctionalComponent<Props> = (props: Props) => {
  const catalog = useContext(Catalog);
  const phrase = catalog.phrase(props.writtenText.curlyName);
  if (!phrase) return <div></div>;

  const selectedLinePhrases = phrase.lines[props.writtenText.line]?.linePhrases;
  const selectedLineTd = selectedLinePhrases?.map((linePhrase, index) =>
    mapLinePhrase(
      linePhrase,
      curlyName => (
        <td key={index}>
          <TextcatPhrase
            writtenText={existingOrNewPhrase(props.writtenText, curlyName)}
            setWrittenText={(newPhrase: WrittenText): void =>
              props.setWrittenText(withPhrase(props.writtenText, newPhrase))
            }
          />
        </td>
      ),
      () => undefined
    )
  );

  const line = phrase.lines.length === 1 ? 0 : props.writtenText.line;
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
    <table class={style.block}>
      <caption>{"{" + phrase.header + "}"}</caption>
      <tr>
        <td colSpan={99}>{select}</td>
      </tr>
      <tr>{selectedLineTd}</tr>
    </table>
  );
};

export default TextcatPhrase;
