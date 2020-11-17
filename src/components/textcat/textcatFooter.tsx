import { FunctionalComponent, h } from "preact";
import { t } from "../../i18n";

const TextcatFooter: FunctionalComponent = () => (
  <footer>
    <hr />
    <ul class="inline">
      <li>
        <abbr title="avalanche bulletin text catalogue: the new generation">
          textcat-ng
        </abbr>
      </li>
      <li>
        {t("version")} {process.env.GIT_VERSION}
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
    </ul>
  </footer>
);

export default TextcatFooter;
