import { FunctionalComponent, h } from "preact";
import * as style from "./style.css";

interface Props {
  option: string | Option;
}

const TextcatOption: FunctionalComponent<Props> = (props: Props) => {
  const { option } = props;
  console.log({ option });
  return (
    <p class={style.block}>
      {typeof option === "string" ? option : option.header.de}
    </p>
  );
};

export default TextcatOption;
