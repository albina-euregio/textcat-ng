import { FunctionalComponent, h } from "preact";
import { useContext, useState } from "preact/hooks";
import { WrittenText, Identifier } from "../../model";
import { Catalog } from "./catalog";
import TextcatSentence from "./sentence";

interface Props {
  writtenTexts: WrittenText[];
  updateWrittenText: (writtenText: WrittenText, index: number) => void;
  addSentence: (curlyName: Identifier) => void;
}

const TextcatComposer: FunctionalComponent<Props> = (props: Props) => {
  const [newSentenceCurlyName, setNewSentenceCurlyName] = useState("");
  const catalog = useContext(Catalog);

  return (
    <section>
      <div>
        <select
          value={newSentenceCurlyName}
          onChange={(e): void =>
            setNewSentenceCurlyName((e.target as HTMLSelectElement).value)
          }
        >
          {catalog.sentences.map(({ curlyName, header }) => (
            <option key={curlyName} value={curlyName}>
              {header}
            </option>
          ))}
        </select>
        <button onClick={(): void => props.addSentence(newSentenceCurlyName)}>
          Add sentence
        </button>
      </div>

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
