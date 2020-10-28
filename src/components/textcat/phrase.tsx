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
  if (!phrase) return <section></section>;
  return (
    <section class={style.block}>
      <header>{phrase.header.de}</header>
      {phrase.lines.map((line, lineIndex) => (
        <p
          key={line}
          class={style.block}
          onClick={(): void => setSelectedLine(lineIndex)}
        >
          {selectedLine !== lineIndex
            ? line.line.de
            : [
                "🗹 ",
                line.linePhrases?.map(({ de: word }, index) =>
                  word?.startsWith("{") ? (
                    <TextcatPhrase
                      key={index}
                      phrase={word.substring(1, word.length - 1)}
                    ></TextcatPhrase>
                  ) : (
                    <span key={index}>{word}</span>
                  )
                )
              ]}
        </p>
      ))}
    </section>
  );
};

export default TextcatPhrase;
