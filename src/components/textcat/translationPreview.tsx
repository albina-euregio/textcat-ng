import { FunctionalComponent, h } from "preact";
import { LANGUAGES, Translations, WrittenText } from "../../model";

interface Props {
  translations: Translations;
  writtenTexts: WrittenText[];
}

const TranslationPreview: FunctionalComponent<Props> = (props: Props) => {
  const { translations, writtenTexts } = props;

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
        <pre>{JSON.stringify(writtenTexts, undefined, 2)}</pre>
      </details>
    </section>
  );
};

export default TranslationPreview;
