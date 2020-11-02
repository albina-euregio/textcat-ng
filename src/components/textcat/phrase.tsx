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

  const selectedLineTr = (
    <tr>
      {phrase.lines[selectedLine]?.linePhrases?.map(({ de: word }, index) => (
        <td key={index}>
          {word?.startsWith("{") ? (
            <TextcatPhrase
              phrase={word.substring(1, word.length - 1)}
            ></TextcatPhrase>
          ) : (
            <span>{word}</span>
          )}
        </td>
      ))}
    </tr>
  );
  const allLinesTr = phrase.lines.map((line, lineIndex) => (
    <tr
      key={line}
      class={style.block}
      onClick={(): void => setSelectedLine(lineIndex)}
    >
      <td colSpan={99}>
        {selectedLine !== lineIndex ? line.line.de : `🗹 ${line.line.de}`}
      </td>
    </tr>
  ));

  return (
    <table class={style.block}>
      <caption>{phrase.header.de}</caption>
      {selectedLineTr}
      {allLinesTr}
    </table>
  );
};

export default TextcatPhrase;
