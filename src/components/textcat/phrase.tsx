import { FunctionalComponent, h } from "preact";
import { useContext, useState } from "preact/hooks";
import { Catalog } from "./catalog";
import * as style from "./style.css";

interface Props {
  phrase: string;
}

const TextcatPhrase: FunctionalComponent<Props> = (props: Props) => {
  const catalog = useContext(Catalog);
  const phrase = catalog.phrase(props.phrase);
  const [selectedLine, setSelectedLine] = useState(
    phrase?.lines?.length === 1 ? 0 : -1
  );
  if (!phrase) return <div></div>;

  const selectedLinePhrases = phrase.lines[selectedLine]?.linePhrases;
  const selectedLineTd = selectedLinePhrases?.map(({ de: word }, index) =>
    word?.startsWith("{") ? (
      <td key={index}>
        <TextcatPhrase phrase={word.substring(1, word.length - 1)} />
      </td>
    ) : (
      undefined
    )
  );

  const select = (
    <select
      size={selectedLine >= 0 ? 1 : phrase.lines.length + 1}
      onChange={(e): void =>
        setSelectedLine(+(e.target as HTMLSelectElement).value)
      }
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
