import { FunctionalComponent } from "preact";
import { useContext } from "preact/hooks";
import { WrittenPhrase, WrittenText } from "../../model";
import FilterSentencesPane from "./filterSentencesPane";
import PhraseComposer from "./phraseComposer";
import { I18nContext } from "./contexts";
import AllSentencesSelect from "./allSentencesSelect";
import CaretUpSquare from "../bootstrap-icons/caret-up-square";
import XSquare from "../bootstrap-icons/x-square";
import CaretDownSquare from "../bootstrap-icons/caret-down-square";
import Clipboard from "../bootstrap-icons/clipboard";
import Copy from "../bootstrap-icons/copy";

interface Props {
  writtenText: WrittenText;
  srcRegion: string;
  readOnly: boolean;
  setWrittenPhrase: (writtenPhrase: WrittenPhrase, index: number) => void;
  addSentence: (writtenPhrase: WrittenPhrase, index: number) => void;
  moveSentence: (fromIndex: number, toIndex: number | undefined) => void;
}

const TextComposer: FunctionalComponent<Props> = (props: Props) => {
  const t = useContext(I18nContext);
  const addWrittenPhrase = (phrase: WrittenPhrase): void =>
    props.addSentence(phrase, props.writtenText.length);

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
      {!props.readOnly && import.meta.env.VITE_SENTENCE_LIST !== "0" && (
        <AllSentencesSelect addWrittenPhrase={addWrittenPhrase} />
      )}
      {!props.readOnly && (
        <FilterSentencesPane
          addWrittenPhrase={addWrittenPhrase}
          srcRegion={props.srcRegion}
        />
      )}

      <h2>{t("heading.selectedSentences")}</h2>
      {props.writtenText.map((writtenPhrase, index, array) => (
        <PhraseComposer
          curlyNameSuffix=""
          srcRegion={props.srcRegion}
          readOnly={props.readOnly}
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
            disabled={
              typeof navigator.clipboard.writeText !== "function" ||
              typeof navigator.clipboard.readText !== "function"
            }
            onClick={(): void => {
              navigator.clipboard.writeText(JSON.stringify(writtenPhrase));
            }}
            title={t("sentence.copy")}
          >
            <Copy />
          </button>
          {!props.readOnly && (
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
            </button>
          )}
          {!props.readOnly && import.meta.env.VITE_MOVE_BUTTONS !== "0" && (
            <button
              disabled={index === 0}
              onClick={(): void => props.moveSentence(index, index - 1)}
              title={t("sentence.moveUp")}
            >
              <CaretUpSquare />
            </button>
          )}
          {!props.readOnly && import.meta.env.VITE_MOVE_BUTTONS !== "0" && (
            <button
              disabled={index >= array.length - 1}
              onClick={(): void => props.moveSentence(index, index + 1)}
              title={t("sentence.moveDown")}
            >
              <CaretDownSquare />
            </button>
          )}
          {!props.readOnly && (
            <button
              onClick={(): void => props.moveSentence(index, undefined)}
              title={t("sentence.remove")}
              class="x-square"
            >
              <XSquare />
            </button>
          )}{" "}
        </PhraseComposer>
      ))}
    </section>
  );
};

export default TextComposer;
