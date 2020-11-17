import { FunctionalComponent, h } from "preact";
import { useContext, useMemo, useState } from "preact/hooks";
import { defaultNewSentenceCurlyName, SearchMode } from "../../model";
import { CatalogContext } from "./contexts";
import plusSquare from "bootstrap-icons/icons/plus-square.svg";
import filter from "bootstrap-icons/icons/filter.svg";
import search from "bootstrap-icons/icons/search.svg";
import { t } from "../../i18n";

interface Props {
  addSentence: (curlyName: string) => void;
}

const AddSentencePane: FunctionalComponent<Props> = (props: Props) => {
  const [curlyName, setCurlyName] = useState(defaultNewSentenceCurlyName());
  const catalog = useContext(CatalogContext);
  const [searchText, setSearchText] = useState("");
  const [searchMode, setSearchMode] = useState(SearchMode.WORDS);
  const filteredSentences = useMemo(() => {
    return searchText
      ? catalog.searchSentences(searchText, searchMode)
      : catalog.sentences;
  }, [catalog, searchText, searchMode]);

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
          onClick={(): void => setSearchMode(SearchMode.WORDS)}
        >
          <img src={filter} width={16} height={16} />
        </button>
        <button
          title={t("sentence.search.prefix")}
          onClick={(): void => setSearchMode(SearchMode.PREFIX)}
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
