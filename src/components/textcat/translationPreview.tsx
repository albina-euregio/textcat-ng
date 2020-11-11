import { FunctionalComponent, h } from "preact";
import { useMemo } from "preact/hooks";
import {
  LANGUAGES,
  TextCatalogue,
  translateAll,
  WrittenText
} from "../../model";

interface Props {
  catalogs: TextCatalogue[];
  writtenTexts: WrittenText[];
}

const TranslationPreview: FunctionalComponent<Props> = (props: Props) => {
  const { catalogs, writtenTexts } = props;
  const translation = useMemo(() => translateAll(catalogs, writtenTexts), [
    catalogs,
    writtenTexts
  ]);

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
