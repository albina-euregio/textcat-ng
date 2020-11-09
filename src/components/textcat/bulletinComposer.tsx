import { FunctionalComponent, h } from "preact";
import { WrittenText, Identifier } from "../../model";
import AddSentencePane from "./addSentencePane";
import PhraseComposer from "./phraseComposer";

interface Props {
  writtenTexts: WrittenText[];
  updateWrittenText: (writtenText: WrittenText, index: number) => void;
  addSentence: (curlyName: Identifier) => void;
  moveSentence: (index: number, direction: number) => void;
}

const BulletinComposer: FunctionalComponent<Props> = (props: Props) => {
  return (
    <section>
      <AddSentencePane addSentence={props.addSentence} />

      {props.writtenTexts.map((writtenText, index) => (
        <PhraseComposer
          key={index}
          writtenText={writtenText}
          setWrittenText={(newText: WrittenText): void =>
            props.updateWrittenText(newText, index)
          }
        >
          {" "}
          <button onClick={(): void => props.moveSentence(index, -1)}>↥</button>
          <button onClick={(): void => props.moveSentence(index, 0)}>✗</button>
          <button onClick={(): void => props.moveSentence(index, +1)}>↧</button>
        </PhraseComposer>
      ))}
    </section>
  );
};

export default BulletinComposer;
