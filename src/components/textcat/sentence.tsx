import { FunctionalComponent, h } from "preact";
import { useContext } from "preact/hooks";
import { Catalog } from "./catalog";
import TextcatPhrase from "./phrase";
import * as style from "./style.css";
import {
  WrittenText,
  WrittenTextProps,
  newPhrase,
  withPhrase
} from "../../model";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props extends WrittenTextProps {}

const TextcatSentence: FunctionalComponent<Props> = (props: Props) => {
  const catalog = useContext(Catalog);
  const sentence = catalog.sentence(props.writtenText.curlyName);
  if (!sentence) return <section></section>;
  return (
    <table class={style.block}>
      <caption>{sentence.header[catalog.lang]}</caption>
      <tr>
        {sentence.phrases.map(phrase => (
          <td key={phrase}>
            <TextcatPhrase
              writtenText={
                props.writtenText?.args?.[phrase] ?? newPhrase(phrase)
              }
              setWrittenText={(newPhrase: WrittenText): void =>
                props.setWrittenText(withPhrase(props.writtenText, newPhrase))
              }
            />
          </td>
        ))}
      </tr>
    </table>
  );
};

export default TextcatSentence;
