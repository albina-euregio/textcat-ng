import { FunctionalComponent, h } from "preact";
import { useContext, useMemo, useState } from "preact/hooks";
import { defaultNewSentenceCurlyName } from "../../model";
import { CatalogContext } from "./contexts";
import plusSquare from "bootstrap-icons/icons/plus-square.svg";
import search from "bootstrap-icons/icons/search.svg";
import { t } from "../../i18n";

interface Props {
  addSentence: (curlyName: string) => void;
}

const AddSentencePane: FunctionalComponent<Props> = (props: Props) => {
  const [curlyName, setCurlyName] = useState(defaultNewSentenceCurlyName());
  const catalog = useContext(CatalogContext);
  const [searchText, setSearchText] = useState("");
  const filteredSentences = useMemo(
    () =>
      searchText ? catalog.searchSentences(searchText) : catalog.sentences,
    [catalog, searchText]
  );

  return (
    <div>
      <label>
        {`[${t("search")}: `}
        <input
          type="text"
          value={searchText}
          onChange={(e): void =>
            setSearchText((e.target as HTMLInputElement).value)
          }
        />
        <button
          title={t("sentence.search")}
          onChange={(e): void =>
            setSearchText((e.target as HTMLInputElement).value)
          }
        >
          <img src={search} width={16} height={16} />
        </button>
        {"]"}
      </label>{" "}
      <label>
        {"[Sentence: "}
        <select
          value={curlyName}
          onChange={(e): void =>
            setCurlyName((e.target as HTMLSelectElement).value)
          }
        >
          {filteredSentences.map(({ curlyName, header }) => (
            <option key={curlyName} value={curlyName}>
              {header}
            </option>
          ))}
        </select>{" "}
        <button
          title={t("sentence.add")}
          onClick={(): void => props.addSentence(curlyName)}
        >
          <img src={plusSquare} width={16} height={16} />
        </button>
        {"]"}
      </label>
    </div>
  );
};

export default AddSentencePane;
