import { FunctionalComponent, h } from "preact";
import { useContext, useState } from "preact/hooks";
import { CatalogContext } from "./contexts";

interface Props {
  addSentence: (curlyName: string) => void;
}

const AddSentencePane: FunctionalComponent<Props> = (props: Props) => {
  const [newSentenceCurlyName, setNewSentenceCurlyName] = useState(
    "Verhältnisse01"
  );
  const catalog = useContext(CatalogContext);

  return (
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
  );
};

export default AddSentencePane;
