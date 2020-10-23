import { FunctionalComponent, h } from "preact";
import * as style from "./style.css";

interface Props {
  phrase: string | Phrase;
}

const TextcatPhrase: FunctionalComponent<Props> = (props: Props) => {
  const { phrase } = props;
  if (typeof phrase === "string") {
    return <section class={style.block}>{phrase}</section>;
  }
  return (
    <section class={style.block}>
      <header>{phrase.header.de}</header>
      {phrase.lines.map(line => (
        <p key={line} class={style.block}>
          {typeof line === "string" ? line : line.line.de}
        </p>
      ))}
    </section>
  );
};

export default TextcatPhrase;
