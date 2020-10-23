import { FunctionalComponent, h } from "preact";
import { useContext } from "preact/hooks";
import { Catalog } from "./catalog";
import * as style from "./style.css";

interface Props {
  phrase: string;
}

const TextcatPhrase: FunctionalComponent<Props> = (props: Props) => {
  const catalog = useContext(Catalog);
  const phrase = catalog.phrase(props.phrase);
  if (!phrase) return <section></section>;
  return (
    <section class={style.block}>
      <header>{phrase.header.de}</header>
      {phrase.lines.map(line => (
        <p key={line} class={style.block}>
          {(line.line.de ?? "")
            .match(/{[^}]+}|[^{}]+/g)
            ?.map((word, index) =>
              word[0] === "{" ? (
                <TextcatPhrase
                  key={index}
                  phrase={word.substring(1, word.length - 1)}
                ></TextcatPhrase>
              ) : (
                <span key={index}>{word}</span>
              )
            )}
        </p>
      ))}
    </section>
  );
};

export default TextcatPhrase;
