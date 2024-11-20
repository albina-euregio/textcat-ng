import { FunctionalComponent } from "preact";
import { useCallback, useContext, useMemo, useState } from "preact/hooks";
import { SearchMode, newSentence, CurlyName, WrittenPhrase } from "../../model";
import { CatalogContext, I18nContext } from "./contexts";
import PhraseComposer from "./phraseComposer";
import Filter from "../bootstrap-icons/filter";
import Search from "../bootstrap-icons/search";
import PlusSquare from "../bootstrap-icons/plus-square";
import { useTraceUpdate } from "./useTraceUpdate";

interface Props {
  addWrittenPhrase: (writtenPhrase: WrittenPhrase) => void;
  srcRegion: string;
}

const FilterSentencesPane: FunctionalComponent<Props> = (props: Props) => {
  const catalog = useContext(CatalogContext);
  const t = useContext(I18nContext);
  const [searchText, setSearchText] = useState("");
  const [searchMode, setSearchMode] = useState(SearchMode.WORDS);

  const filteredSentences = useMemo(() => {
    return searchText
      ? catalog.searchSentences(searchText, searchMode)
      : catalog.sentences;
  }, [catalog, searchText, searchMode]);

  const searchWords = useMemo(
    () => catalog.splitSearchText(searchText),
    [catalog, searchText]
  );

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
          class="f-auto sentences"
          type="text"
          value={searchText}
          onInput={(e): void => {
            setSearchText((e.target as HTMLInputElement).value);
          }}
        />
      </label>
      {/* composer for filtered sentences */}
      {searchText &&
        filteredSentences
          .slice(0, 5)
          .map(writtenPhrase => (
            <PhraseDraftComposer
              addWrittenPhrase={props.addWrittenPhrase}
              curlyName={writtenPhrase.curlyName}
              key={writtenPhrase.curlyName}
              searchWords={searchWords}
              srcRegion={props.srcRegion}
            />
          ))}
    </div>
  );
};

interface PhraseDraftComposerProps {
  addWrittenPhrase: (writtenPhrase: WrittenPhrase) => void;
  curlyName: CurlyName;
  searchWords?: string[];
  srcRegion: string;
}

const PhraseDraftComposer: FunctionalComponent<PhraseDraftComposerProps> = ({
  addWrittenPhrase,
  curlyName,
  searchWords,
  srcRegion
}: PhraseDraftComposerProps) => {
  useTraceUpdate("PhraseDraftComposer", {
    addWrittenPhrase,
    curlyName,
    searchWords,
    srcRegion
  });
  const t = useContext(I18nContext);

  const [writtenPhraseDraft, setWrittenPhraseDraft] = useState(
    newSentence(curlyName)
  );

  const addWrittenPhrase0 = useCallback(
    () => addWrittenPhrase(writtenPhraseDraft),
    []
  );

  return (
    <PhraseComposer
      readOnly={false}
      curlyName={curlyName}
      curlyNameSuffix={""}
      srcRegion={srcRegion}
      searchWords={searchWords}
      writtenPhrase={writtenPhraseDraft}
      setWrittenPhrase={setWrittenPhraseDraft}
    >
      <button title={t("sentence.add")} onClick={addWrittenPhrase0}>
        <PlusSquare />
      </button>{" "}
    </PhraseComposer>
  );
};

export default FilterSentencesPane;
