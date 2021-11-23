import { FunctionalComponent } from "preact";
import { StateUpdater } from "preact/hooks";
import { t } from "../../i18n";

interface Props {
  showTranslation: boolean;
  setShowTranslation: StateUpdater<boolean>;
}

const TranslationCheckbox: FunctionalComponent<Props> = (props: Props) => (
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

export default TranslationCheckbox;
