import { FunctionalComponent, h } from "preact";
import { useContext, useState } from "preact/hooks";
import { defaultNewSentenceCurlyName } from "../../model";
import { CatalogContext } from "./contexts";
import plusSquare from "bootstrap-icons/icons/plus-square.svg";

interface Props {
  addSentence: (curlyName: string) => void;
}

const AddSentencePane: FunctionalComponent<Props> = (props: Props) => {
  const [curlyName, setCurlyName] = useState(defaultNewSentenceCurlyName());
  const catalog = useContext(CatalogContext);

  return (
    <label>
      {"[Sentence: "}
      <select
        value={curlyName}
        onChange={(e): void =>
          setCurlyName((e.target as HTMLSelectElement).value)
        }
      >
        {catalog.sentences.map(({ curlyName, header }) => (
          <option key={curlyName} value={curlyName}>
            {header}
          </option>
        ))}
      </select>{" "}
      <button onClick={(): void => props.addSentence(curlyName)}>
        <img src={plusSquare} width={16} height={16} />
      </button>
      {"]"}
    </label>
  );
};

export default AddSentencePane;
