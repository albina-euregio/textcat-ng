import { FunctionalComponent } from "preact";
import { AllTextCatalogues, TextCatalogue } from "../../model";
import PhraseEditor from "./phraseEditor";
import SentenceEditor from "./sentenceEditor";
import { useState } from "preact/hooks";

interface Props {
  catalog: TextCatalogue;
  catalogs: AllTextCatalogues;
  setCatalogs(catalogs: AllTextCatalogues): void;
}

const TextcatEditor: FunctionalComponent<Props> = ({
  catalog,
  catalogs,
  setCatalogs
}: Props) => {
  const [sentenceCurlyName, setSentenceCurlyName] = useState("");
  const [phraseCurlyName, setPhraseCurlyName] = useState("");
  return (
    <>
      <SentenceEditor
        sentences={catalog.sentences}
        catalogs={catalogs}
        sentenceCurlyName={sentenceCurlyName}
        setSentenceCurlyName={setSentenceCurlyName}
        onSentenceChange={async (lang, phrase) =>
          setCatalogs(await catalogs.changePhrase(lang, phrase))
        }
      />
      <PhraseEditor
        phrases={catalog.phrases}
        catalogs={catalogs}
        phraseCurlyName={phraseCurlyName}
        setPhraseCurlyName={setPhraseCurlyName}
        setSentenceCurlyName={setSentenceCurlyName}
        onPhraseChange={async (lang, phrase) =>
          setCatalogs(await catalogs.changePhrase(lang, phrase))
        }
      />
    </>
  );
};

export default TextcatEditor;
