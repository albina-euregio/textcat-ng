import { FunctionalComponent } from "preact";
import { StateUpdater } from "preact/hooks";
import { LANGUAGES, Lang } from "../../model";
import { t } from "../../i18n";

interface Props {
  srcLang: Lang;
  setSrcLang: StateUpdater<Lang>;
}

const LanguageSelect: FunctionalComponent<Props> = (props: Props) => (
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

export default LanguageSelect;
