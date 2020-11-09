import { FunctionalComponent, h } from "preact";
import { WrittenText, Identifier } from "../../model";
import AddSentencePane from "./addSentencePane";
import PhraseComposer from "./phraseComposer";

interface Props {
  writtenTexts: WrittenText[];
  updateWrittenText: (writtenText: WrittenText, index: number) => void;
  addSentence: (curlyName: Identifier) => void;
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
        />
      ))}
    </section>
  );
};

export default BulletinComposer;
