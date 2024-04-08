import { FunctionalComponent } from "preact";
import { Dispatch, StateUpdater, useContext } from "preact/hooks";
import { LANGUAGES, Lang } from "../../model";
import { I18nContext } from "./contexts";

interface Props {
  srcLang: Lang;
  setSrcLang: Dispatch<StateUpdater<Lang>>;
}

const LanguageSelect: FunctionalComponent<Props> = (props: Props) => {
  const t = useContext(I18nContext);
  return (
    <label>
      {`[${t("language")}: `}
      <select
        value={props.srcLang}
        onChange={(e): void =>
          props.setSrcLang((e.target as HTMLSelectElement).value as Lang)
        }
      >
        {LANGUAGES.map(lang => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
      {"]"}
    </label>
  );
};

export default LanguageSelect;
