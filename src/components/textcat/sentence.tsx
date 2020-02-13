import { FunctionalComponent, h } from "preact";
import TextcatPhrase from "./phrase";
import * as style from "./style.css";

interface Props {
  sentence: Sentence;
}

const TextcatSentence: FunctionalComponent<Props> = (props: Props) => {
  const { sentence } = props;
  return (
    <section class={style.block}>
      <header>{sentence.header.de}</header>
      {sentence.phrases.map(phrase => (
        <TextcatPhrase key={phrase} phrase={phrase} />
      ))}
    </section>
  );
};

export default TextcatSentence;
