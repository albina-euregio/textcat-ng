import { FunctionalComponent } from "preact";
import { WrittenPhrase, WrittenText } from "../../model";
import FilterSentencesPane from "./filterSentencesPane";
import PhraseComposer from "./phraseComposer";
import { t } from "../../i18n";
import AllSentencesSelect from "./allSentencesSelect";
import CaretUpSquare from "../bootstrap-icons/caret-up-square";
import XSquare from "../bootstrap-icons/x-square";
import CaretDownSquare from "../bootstrap-icons/caret-down-square";
import Clipboard from "../bootstrap-icons/clipboard";
import Copy from "../bootstrap-icons/copy";
import PhraseEditor from "./phraseEditor";

interface Props {
  writtenText: WrittenText;
  srcRegion: string;
  setWrittenPhrase: (writtenPhrase: WrittenPhrase, index: number) => void;
  addSentence: (writtenPhrase: WrittenPhrase, index: number) => void;
  moveSentence: (fromIndex: number, toIndex: number | undefined) => void;
}

const TextComposer: FunctionalComponent<Props> = (props: Props) => {
  const addWrittenPhrase = (phrase: WrittenPhrase): void =>
    props.addSentence(phrase, props.writtenText.length);

  const copySentenceToClipboard = (writtenPhrase: WrittenPhrase) => {
    navigator.clipboard.writeText(JSON.stringify(writtenPhrase));
  };

  const pasteSentenceFromClipboard = async (index: number) => {
    const copiedPhrase = await navigator.clipboard.readText();
    try {
      const phrase: WrittenPhrase = JSON.parse(copiedPhrase);
      if (!phrase.curlyName) {
        return;
      }
      console.log("Pasting sentence", phrase);
      props.addSentence(phrase, index + 1);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section>
      <PhraseEditor />
      <AllSentencesSelect addWrittenPhrase={addWrittenPhrase} />
      <FilterSentencesPane addWrittenPhrase={addWrittenPhrase} />

      <h2>{t("heading.selectedSentences")}</h2>
      {props.writtenText.map((writtenPhrase, index, array) => (
        <PhraseComposer
          curlyNameSuffix=""
          srcRegion={props.srcRegion}
          key={index}
          showError={true}
          writtenPhrase={writtenPhrase}
          setWrittenPhrase={(newText: WrittenPhrase): void =>
            props.setWrittenPhrase(newText, index)
          }
          onDragStart={event => {
            if (!event.dataTransfer) return;
            event.dataTransfer.setData("text", JSON.stringify(index));
            event.dataTransfer.dropEffect = "move";
          }}
          onDrop={event => {
            event.stopPropagation();
            event.preventDefault();
            const fromIndex = event.dataTransfer?.getData("text");
            if (fromIndex === undefined) return;
            props.moveSentence(+fromIndex, index);
          }}
        >
          <button
            disabled={index === 0}
            onClick={(): void => props.moveSentence(index, index - 1)}
            title={t("sentence.moveUp")}
          >
            <CaretUpSquare />
          </button>
          <button
            onClick={(): void => props.moveSentence(index, undefined)}
            title={t("sentence.remove")}
          >
            <XSquare />
          </button>
          <button
            disabled={index >= array.length - 1}
            onClick={(): void => props.moveSentence(index, index + 1)}
            title={t("sentence.moveDown")}
          >
            <CaretDownSquare />
          </button>
          <button
            disabled={
              typeof navigator.clipboard.writeText !== "function" ||
              typeof navigator.clipboard.readText !== "function"
            }
            onClick={(): void => copySentenceToClipboard(writtenPhrase)}
            title={t("sentence.copy")}
          >
            <Copy />
          </button>
          <button
            disabled={
              typeof navigator.clipboard.writeText !== "function" ||
              typeof navigator.clipboard.readText !== "function"
            }
            onClick={(): void => {
              pasteSentenceFromClipboard(index);
            }}
            title={t("sentence.paste")}
          >
            <Clipboard />
          </button>{" "}
        </PhraseComposer>
      ))}
    </section>
  );
};

export default TextComposer;
