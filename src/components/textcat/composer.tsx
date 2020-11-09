import { FunctionalComponent, h } from "preact";
import { WrittenText, Identifier } from "../../model";
import AddSentencePane from "./addSentencePane";
import TextcatPhrase from "./phrase";

interface Props {
  writtenTexts: WrittenText[];
  updateWrittenText: (writtenText: WrittenText, index: number) => void;
  addSentence: (curlyName: Identifier) => void;
}

const TextcatComposer: FunctionalComponent<Props> = (props: Props) => {
  return (
    <section>
      <AddSentencePane addSentence={props.addSentence} />

      {props.writtenTexts.map((writtenText, index) => (
        <TextcatPhrase
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

export default TextcatComposer;
