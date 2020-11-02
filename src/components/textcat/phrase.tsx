import { FunctionalComponent, h } from "preact";
import { useContext } from "preact/hooks";
import { Catalog } from "./catalog";
import * as style from "./style.css";
import { existingOrNewPhrase, withPhrase, withLine } from "./writtenText";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props extends WrittenTextProps {}

const TextcatPhrase: FunctionalComponent<Props> = (props: Props) => {
  const catalog = useContext(Catalog);
  const phrase = catalog.phrase(props.writtenText.curlyName);
  if (!phrase) return <div></div>;

  const selectedLinePhrases = phrase.lines[props.writtenText.line]?.linePhrases;
  const selectedLineTd = selectedLinePhrases?.map(({ de: word }, index) => {
    if (!word?.startsWith("{")) return undefined;
    const curlyName = word.substring(1, word.length - 1);
    return (
      <td key={index}>
        <TextcatPhrase
          writtenText={existingOrNewPhrase(props.writtenText, curlyName)}
          setWrittenText={(newPhrase: WrittenText): void =>
            props.setWrittenText(withPhrase(props.writtenText, newPhrase))
          }
        />
      </td>
    );
  });

  const select = (
    <select
      size={props.writtenText.line >= 0 ? 1 : phrase.lines.length + 1}
      onChange={(e): void => {
        const line = +(e.target as HTMLSelectElement).value;
        props.setWrittenText(withLine(props.writtenText, line));
      }}
    >
      {phrase.lines.map((line, lineIndex) => (
        <option key={line} value={lineIndex}>
          {line.line.de}
        </option>
      ))}
    </select>
  );

  return (
    <table class={style.block}>
      <caption>{"{" + phrase.header.de + "}"}</caption>
      <tr>
        <td colSpan={99}>{select}</td>
      </tr>
      <tr>{selectedLineTd}</tr>
    </table>
  );
};

export default TextcatPhrase;
