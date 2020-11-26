import { FunctionalComponent, h } from "preact";
import { WrittenPhrase, WrittenText } from "../../model";
import FilterSentencesPane from "./filterSentencesPane";
import PhraseComposer from "./phraseComposer";
import caretDownSquare from "bootstrap-icons/icons/caret-down-square.svg";
import caretUpSquare from "bootstrap-icons/icons/caret-up-square.svg";
import xSquare from "bootstrap-icons/icons/x-square.svg";
import { t } from "../../i18n";
import AllSentencesSelect from "./allSentencesSelect";

interface Props {
  writtenText: WrittenText;
  srcRegion: string;
  setWrittenPhrase: (writtenPhrase: WrittenPhrase, index: number) => void;
  moveSentence: (index: number, direction: number) => void;
}

const TextComposer: FunctionalComponent<Props> = (props: Props) => {
  const addWrittenPhrase = (phrase: WrittenPhrase): void =>
    props.setWrittenPhrase(phrase, props.writtenText.length);
  return (
    <section>
      <AllSentencesSelect addWrittenPhrase={addWrittenPhrase} />
      <FilterSentencesPane addWrittenPhrase={addWrittenPhrase} />

      <h2>{t("heading.selectedSentences")}</h2>
      {props.writtenText.map((writtenPhrase, index, array) => (
        <PhraseComposer
          curlyNameSuffix=""
          srcRegion={props.srcRegion}
          key={index}
          writtenPhrase={writtenPhrase}
          setWrittenPhrase={(newText: WrittenPhrase): void =>
            props.setWrittenPhrase(newText, index)
          }
        >
          {" "}
          <button
            disabled={index === 0}
            onClick={(): void => props.moveSentence(index, -1)}
            title={t("sentence.moveUp")}
          >
            <img src={caretUpSquare} width={16} height={16} />
          </button>
          <button
            onClick={(): void => props.moveSentence(index, 0)}
            title={t("sentence.remove")}
          >
            <img src={xSquare} width={16} height={16} />
          </button>
          <button
            disabled={index >= array.length - 1}
            onClick={(): void => props.moveSentence(index, +1)}
            title={t("sentence.moveDown")}
          >
            <img src={caretDownSquare} width={16} height={16} />
          </button>
        </PhraseComposer>
      ))}
    </section>
  );
};

export default TextComposer;
