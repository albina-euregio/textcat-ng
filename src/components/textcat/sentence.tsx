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
    <table class={style.block}>
      <caption>{sentence.header.de}</caption>
      <tr>
        {sentence.phrases.map(phrase => (
          <td key={phrase}>
            <TextcatPhrase phrase={phrase} />
          </td>
        ))}
      </tr>
    </table>
  );
};

export default TextcatSentence;
