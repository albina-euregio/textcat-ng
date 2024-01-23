import { FunctionalComponent } from "preact";
import { AllTextCatalogues, TextCatalogue } from "../../model";
import PhraseEditor from "./phraseEditor";
import SentenceEditor from "./sentenceEditor";

interface Props {
  catalog: TextCatalogue;
  catalogs: AllTextCatalogues;
  setCatalogs(catalogs: AllTextCatalogues): void;
}

const TextcatEditor: FunctionalComponent<Props> = ({
  catalog,
  catalogs,
  setCatalogs
}: Props) => (
  <>
    <SentenceEditor
      sentences={catalog.sentences}
      catalogs={catalogs}
      onSentenceChange={async (lang, phrase) =>
        setCatalogs(await catalogs.changePhrase(lang, phrase))
      }
    />
    <PhraseEditor
      phrases={catalog.phrases}
      catalogs={catalogs}
      onPhraseChange={async (lang, phrase) =>
        setCatalogs(await catalogs.changePhrase(lang, phrase))
      }
    />
  </>
);

export default TextcatEditor;
