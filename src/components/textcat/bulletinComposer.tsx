import { FunctionalComponent, h } from "preact";
import { WrittenText, Identifier } from "../../model";
import AddSentencePane from "./addSentencePane";
import PhraseComposer from "./phraseComposer";
import caretDownSquare from "bootstrap-icons/icons/caret-down-square.svg";
import caretUpSquare from "bootstrap-icons/icons/caret-up-square.svg";
import xSquare from "bootstrap-icons/icons/x-square.svg";
import { t } from "../../i18n";

interface Props {
  writtenTexts: WrittenText[];
  srcRegion: string;
  updateWrittenText: (writtenText: WrittenText, index: number) => void;
  addSentence: (curlyName: Identifier) => void;
  moveSentence: (index: number, direction: number) => void;
}

const BulletinComposer: FunctionalComponent<Props> = (props: Props) => {
  return (
    <section>
      <AddSentencePane addSentence={props.addSentence} />

      {props.writtenTexts.map((writtenText, index) => (
        <PhraseComposer
          curlyNameSuffix=""
          srcRegion={props.srcRegion}
          key={index}
          writtenText={writtenText}
          setWrittenText={(newText: WrittenText): void =>
            props.updateWrittenText(newText, index)
          }
        >
          {" "}
          <button
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

export default BulletinComposer;
