import { FunctionalComponent, h } from "preact";
import { LANGUAGES, Translations, WrittenText } from "../../model";
import { t } from "../../i18n";

interface Props {
  translations: Translations;
  writtenText: WrittenText;
}

const TranslationPreview: FunctionalComponent<Props> = (props: Props) => {
  const { translations, writtenText } = props;

  return (
    <section>
      <table>
        {LANGUAGES.map(lang => (
          <tr key={lang}>
            <th class="pr-10">{lang}</th>
            <td>{translations[lang]}</td>
          </tr>
        ))}
      </table>
      <details open={false}>
        <summary>{t("showDetails")}</summary>
        <pre>{JSON.stringify(writtenText, undefined, 2)}</pre>
      </details>
    </section>
  );
};

export default TranslationPreview;
