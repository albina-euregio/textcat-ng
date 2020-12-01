import { FunctionalComponent, h } from "preact";
import { useContext, useState } from "preact/hooks";
import plusSquare from "bootstrap-icons/icons/plus-square.svg";
import { t } from "../../i18n";
import { sentencePreview, WrittenPhrase, newSentence } from "../../model";
import { CatalogContext } from "./contexts";

interface Props {
  addWrittenPhrase: (writtenPhrase: WrittenPhrase) => void;
}

const AllSentencesSelect: FunctionalComponent<Props> = (props: Props) => {
  const catalog = useContext(CatalogContext);
  const [curlyName, setCurlyName] = useState("");
  return (
    <div class="block">
      <h2>{`${t("heading.allSentences")} `}</h2>
      <label class="d-flex mt-10">
        <button
          title={t("sentence.add")}
          disabled={!curlyName}
          onClick={(): void => props.addWrittenPhrase(newSentence(curlyName))}
        >
          <img src={plusSquare} width={16} height={16} />
        </button>
        <select
          class="f-auto f-truncate"
          value={curlyName}
          onChange={(e): void =>
            setCurlyName((e.target as HTMLSelectElement).value)
          }
        >
          {catalog.sentences.map(sentence => (
            <option key={sentence.curlyName} value={sentence.curlyName}>
              {sentencePreview(sentence, catalog)}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default AllSentencesSelect;
