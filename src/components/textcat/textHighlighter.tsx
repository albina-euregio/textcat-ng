import { FunctionalComponent } from "preact";
import { findAll } from "highlight-words-core";

interface Props {
  text: string;
  searchWords?: string[];
}

const TextHighlighter: FunctionalComponent<Props> = (props: Props) => {
  if (!props.searchWords?.length) {
    return <>{props.text}</>;
  }
  const chunks = findAll({
    textToHighlight: props.text,
    searchWords: props.searchWords
  }).map(({ highlight, start, end }) =>
    highlight ? (
      <mark>{props.text.slice(start, end)}</mark>
    ) : (
      <>{props.text.slice(start, end)}</>
    )
  );
  return <>{chunks}</>;
};

export default TextHighlighter;
