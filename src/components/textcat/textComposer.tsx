import { FunctionalComponent, h } from "preact";
import { WrittenPhrase, WrittenText, Identifier } from "../../model";
import AddSentencePane from "./addSentencePane";
import PhraseComposer from "./phraseComposer";
import caretDownSquare from "bootstrap-icons/icons/caret-down-square.svg";
import caretUpSquare from "bootstrap-icons/icons/caret-up-square.svg";
import xSquare from "bootstrap-icons/icons/x-square.svg";
import { t } from "../../i18n";

interface Props {
  writtenText: WrittenText;
  srcRegion: string;
  setWrittenPhrase: (writtenPhrase: WrittenPhrase, index: number) => void;
  moveSentence: (index: number, direction: number) => void;
}

const TextComposer: FunctionalComponent<Props> = (props: Props) => {
  return (
    <section>
      <AddSentencePane
        addWrittenPhrase={(phrase): void =>
          props.setWrittenPhrase(phrase, props.writtenText.length)
        }
      />

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
          {index > 0 && (
            <button
              onClick={(): void => props.moveSentence(index, -1)}
              title={t("sentence.moveUp")}
            >
              <img src={caretUpSquare} width={16} height={16} />
            </button>
          )}
          <button
            onClick={(): void => props.moveSentence(index, 0)}
            title={t("sentence.remove")}
          >
            <img src={xSquare} width={16} height={16} />
          </button>
          {index < array.length - 1 && (
            <button
              onClick={(): void => props.moveSentence(index, +1)}
              title={t("sentence.moveDown")}
            >
              <img src={caretDownSquare} width={16} height={16} />
            </button>
          )}
        </PhraseComposer>
      ))}
    </section>
  );
};

export default TextComposer;
