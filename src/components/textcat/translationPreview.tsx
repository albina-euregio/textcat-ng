import { FunctionalComponent } from "preact";
import { LANGUAGES, Translations } from "../../model";

interface Props {
  translations: Translations;
}

const TranslationPreview: FunctionalComponent<Props> = (props: Props) => {
  const { translations } = props;

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
    </section>
  );
};

export default TranslationPreview;
