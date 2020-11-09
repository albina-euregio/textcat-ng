import { FunctionalComponent, h } from "preact";
import { TextcatCatalog } from "../../model";
import { useMemo } from "preact/hooks";
import { IntlText, Lang, LANGUAGES, WrittenText } from "../../model";

interface Props {
  catalogs: TextcatCatalog[];
  writtenTexts: WrittenText[];
}

const TranslationPreview: FunctionalComponent<Props> = (props: Props) => {
  const { catalogs, writtenTexts } = props;
  const translation = useMemo(() => {
    const translation: Partial<Record<Lang, IntlText>> = {};
    catalogs.forEach(catalog => {
      const { lang } = catalog;
      try {
        translation[lang] = catalog.translate(writtenTexts);
      } catch (e) {
        if (!String(e).includes("Unset phrase")) {
          console.warn(e);
        }
        translation[lang] = String(e);
      }
    });
    return translation;
  }, [catalogs, writtenTexts]);

  return (
    <section>
      <table>
        {LANGUAGES.map(lang => (
          <tr key={lang}>
            <th class="pr-10">{lang}</th>
            <td>{translation[lang]}</td>
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
