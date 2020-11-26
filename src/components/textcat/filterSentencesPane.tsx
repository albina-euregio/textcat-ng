import { FunctionalComponent, h } from "preact";
import { useContext, useMemo, useState } from "preact/hooks";
import {
  SearchMode,
  newSentence,
  Identifier,
  WrittenPhrase
} from "../../model";
import { CatalogContext } from "./contexts";
import PhraseComposer from "./phraseComposer";
import plusSquare from "bootstrap-icons/icons/plus-square.svg";
import filter from "bootstrap-icons/icons/filter.svg";
import search from "bootstrap-icons/icons/search.svg";
import { t } from "../../i18n";

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
    Record<Identifier, WrittenPhrase>
  >({});
  function setWrittenPhraseDraft(writtenPhrase: WrittenPhrase): void {
    setWrittenPhraseDrafts(ps => ({
      ...ps,
      [writtenPhrase.curlyName]: writtenPhrase
    }));
  }
  function writtenPhraseDraft(curlyName: Identifier): WrittenPhrase {
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
        <input
          class="f-auto"
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
              writtenPhrase={writtenPhrase}
              setWrittenPhrase={(phrase): void => setWrittenPhraseDraft(phrase)}
            >
              {" "}
              <button
                title={t("sentence.add")}
                onClick={(): void => props.addWrittenPhrase(writtenPhrase)}
              >
                <img src={plusSquare} width={16} height={16} />
              </button>
            </PhraseComposer>
          ))}
    </div>
  );
};

export default FilterSentencesPane;
