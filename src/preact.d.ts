/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_DEEPL_API?: string;
  VITE_DEEPL_API_KEY?: string;
  VITE_GIT_VERSION: string;
  VITE_SENTENCE_LIST: "0" | "1";
  VITE_TEXTCAT_EDITOR: "0" | "1";
}
