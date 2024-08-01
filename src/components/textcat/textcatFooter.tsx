import { FunctionalComponent, ComponentChildren } from "preact";
import { useContext } from "preact/hooks";
import { I18nContext } from "./contexts";

interface Props {
  children?: ComponentChildren;
}

const TextcatFooter: FunctionalComponent = (props: Props) => {
  const t = useContext(I18nContext);
  return (
    <footer>
      <hr />
      <ul class="inline">
        <li>
          <abbr title={t("textcat-ng")}>textcat-ng</abbr>
        </li>
        <li>
          {t("version")} {import.meta.env.VITE_GIT_VERSION}
        </li>
        <li>
          <a
            href="https://gitlab.com/albina-euregio/textcat-ng"
            target="_blank"
            rel="noopener noreferrer"
          >
            gitlab.com/albina-euregio/textcat-ng
          </a>
        </li>
        <li>
          <a
            href="https://gitlab.com/albina-euregio/textcat-ng/-/blob/master/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
          >
            GPL v3
          </a>
        </li>
        {props.children}
      </ul>
    </footer>
  );
};

export default TextcatFooter;
