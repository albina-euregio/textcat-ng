import { FunctionalComponent } from "preact";
import { useContext, useMemo, useState } from "preact/hooks";
import { SearchMode, newSentence, CurlyName, WrittenPhrase } from "../../model";
import { CatalogContext } from "./contexts";
import PhraseComposer from "./phraseComposer";
import { t } from "../../i18n";
import Filter from "../bootstrap-icons/filter";
import Search from "../bootstrap-icons/search";
import PlusSquare from "../bootstrap-icons/plus-square";

interface Props {
  addWrittenPhrase: (writtenPhrase: WrittenPhrase) => void;
}

const FilterSentencesPane: FunctionalComponent<Props> = (props: Props) => {
  const catalog = useContext(CatalogContext);
  const [searchText, setSearchText] = useState("");
  const [searchMode, setSearchMode] = useState(SearchMode.WORDS);
  const filteredSentences = useMemo(() => {
    return searchText
      ? catalog.searchSentences(searchText, searchMode)
      : catalog.sentences;
  }, [catalog, searchText, searchMode]);

  const [writtenPhraseDrafts, setWrittenPhraseDrafts] = useState<
    Record<CurlyName, WrittenPhrase>
  >({});
  function setWrittenPhraseDraft(writtenPhrase: WrittenPhrase): void {
    setWrittenPhraseDrafts(ps => ({
      ...ps,
      [writtenPhrase.curlyName]: writtenPhrase
    }));
  }
  function writtenPhraseDraft(curlyName: CurlyName): WrittenPhrase {
    let phrase = writtenPhraseDrafts[curlyName];
    if (!phrase) {
      phrase = newSentence(curlyName);
      setWrittenPhraseDraft(phrase);
    }
    return phrase;
  }

  return (
    <div class="block">
      <h2>{`${t("heading.searchSentences")} `}</h2>
      <label class="d-flex">
        <span class="pr-10">{`${t("search")}:`}</span>
        {/* search */}
        <button
          title={t("sentence.search")}
          onClick={(): void => setSearchMode(SearchMode.WORDS)}
        >
          <Filter />
        </button>
        <button
          title={t("sentence.search.prefix")}
          onClick={(): void => setSearchMode(SearchMode.PREFIX)}
        >
          <Search />
        </button>
        <input
          class="f-auto"
          type="text"
          value={searchText}
          onChange={(e): void =>
            setSearchText((e.target as HTMLInputElement).value)
          }
        />
      </label>
      {/* composer for filtered sentences */}
      {searchText &&
        filteredSentences
          .map(({ curlyName }) => writtenPhraseDraft(curlyName))
          .map(writtenPhrase => (
            <PhraseComposer
              key={writtenPhrase.curlyName}
              curlyNameSuffix={""}
              srcRegion={""}
              searchWords={catalog.splitSearchText(searchText)}
              writtenPhrase={writtenPhrase}
              setWrittenPhrase={(phrase): void => setWrittenPhraseDraft(phrase)}
            >
              <button
                title={t("sentence.add")}
                onClick={(): void => props.addWrittenPhrase(writtenPhrase)}
              >
                <PlusSquare />
              </button>{" "}
            </PhraseComposer>
          ))}
    </div>
  );
};

export default FilterSentencesPane;
