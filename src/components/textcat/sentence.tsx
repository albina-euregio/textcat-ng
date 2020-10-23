import { FunctionalComponent, h } from "preact";
import { useContext } from "preact/hooks";
import { Catalog } from "./catalog";
import TextcatPhrase from "./phrase";
import * as style from "./style.css";

interface Props {
  sentence: string;
}

const TextcatSentence: FunctionalComponent<Props> = (props: Props) => {
  const catalog = useContext(Catalog);
  const sentence = catalog.sentence(props.sentence);
  if (!sentence) return <section></section>;
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
