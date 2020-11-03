import { FunctionalComponent, h } from "preact";
import { WrittenText } from "../../model";
import TextcatSentence from "./sentence";

interface Props {
  writtenTexts: WrittenText[];
  updateWrittenText: (writtenText: WrittenText, index: number) => void;
}

const TextcatComposer: FunctionalComponent<Props> = (props: Props) => {
  return (
    <section>
      {props.writtenTexts.map((writtenText, index) => (
        <TextcatSentence
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
