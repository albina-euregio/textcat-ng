import { FunctionalComponent, h } from "preact";
import { useContext, useState } from "preact/hooks";
import { defaultNewSentenceCurlyName } from "../../model";
import { CatalogContext } from "./contexts";
import plusSquare from "bootstrap-icons/icons/plus-square.svg";

interface Props {
  addSentence: (curlyName: string) => void;
}

const AddSentencePane: FunctionalComponent<Props> = (props: Props) => {
  const [newSentenceCurlyName, setNewSentenceCurlyName] = useState(
    defaultNewSentenceCurlyName()
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
        <img src={plusSquare} width={16} height={16} />
      </button>
    </div>
  );
};

export default AddSentencePane;
