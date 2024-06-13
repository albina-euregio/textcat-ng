import { FunctionalComponent } from "preact";
import { LANGUAGE_VARIANTS, Translations } from "../../model";

interface Props {
  translations: Translations;
}

const TranslationPreview: FunctionalComponent<Props> = (props: Props) => {
  const { translations } = props;
  return (
    <section>
      <table>
        <tbody>
          {LANGUAGE_VARIANTS.map(lang => (
            <tr key={lang}>
              <th class="pr-10">{lang}</th>
              <td>{translations[lang]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default TranslationPreview;
