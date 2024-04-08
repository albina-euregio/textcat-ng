import { FunctionalComponent } from "preact";
import { Dispatch, StateUpdater, useContext } from "preact/hooks";
import { I18nContext } from "./contexts";

interface Props {
  showTranslation: boolean;
  setShowTranslation: Dispatch<StateUpdater<boolean>>;
}

const TranslationCheckbox: FunctionalComponent<Props> = (props: Props) => {
  const t = useContext(I18nContext);
  return (
    <label>
      {"["}
      <input
        type="checkbox"
        checked={props.showTranslation}
        onChange={(e): void =>
          props.setShowTranslation((e.target as HTMLInputElement).checked)
        }
      ></input>
      {` ${t("translations.show")}]`}
    </label>
  );
};

export default TranslationCheckbox;
