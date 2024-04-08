import { FunctionalComponent } from "preact";
import { useContext, useState } from "preact/hooks";
import {
  sentencePreview,
  WrittenPhrase,
  newSentence,
  newJoker
} from "../../model";
import { CatalogContext, I18nContext } from "./contexts";
import BracesAsterisk from "../bootstrap-icons/braces-asterisk";
import PlusSquare from "../bootstrap-icons/plus-square";

interface Props {
  addWrittenPhrase: (writtenPhrase: WrittenPhrase) => void;
}

const AllSentencesSelect: FunctionalComponent<Props> = (props: Props) => {
  const catalog = useContext(CatalogContext);
  const t = useContext(I18nContext);
  const [curlyName, setCurlyName] = useState("");
  const url =
    window.location != window.parent.location
      ? document.referrer
      : document.location.href;
  return (
    <div class="block">
      <h2>{`${t("heading.allSentences")} `}</h2>
      {url.startsWith("https://admin.avalanche.report") ? (
        <label class="d-flex mt-10">
          <button
            title={t("sentence.add")}
            onClick={(): void => props.addWrittenPhrase(newJoker())}
          >
            <BracesAsterisk /> {t("sentence.joker")}
          </button>
        </label>
      ) : (
        ""
      )}
      <label class="d-flex mt-10">
        <button
          title={t("sentence.add")}
          disabled={!curlyName}
          onClick={(): void => props.addWrittenPhrase(newSentence(curlyName))}
        >
          <PlusSquare />
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
