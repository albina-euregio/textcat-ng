import { FunctionalComponent } from "preact";
import { LANGUAGES, Translations } from "../../model";

interface Props {
  translations: Translations;
}

const TranslationPreview: FunctionalComponent<Props> = (props: Props) => {
  const { translations } = props;
  const langs = [...LANGUAGES, "de_AT" as const].sort((l1, l2) =>
    l1.localeCompare(l2)
  );

  return (
    <section>
      <table>
        {langs.map(lang => (
          <tr key={lang}>
            <th class="pr-10">{lang}</th>
            <td>{translations[lang]}</td>
          </tr>
        ))}
      </table>
    </section>
  );
};

export default TranslationPreview;
