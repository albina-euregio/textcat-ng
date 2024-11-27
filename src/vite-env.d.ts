/// <reference types="vite/client" />

declare module "*.vue" {
  import { defineComponent } from "vue";
  const Component: ReturnType<typeof defineComponent>;
  export default Component;
}

interface ImportMetaEnv {
  VITE_DEEPL_API?: string;
  VITE_DEEPL_API_KEY?: string;
  VITE_GIT_VERSION: string;
  VITE_MOVE_BUTTONS: "0" | "1";
  VITE_SENTENCE_LIST: "0" | "1";
  VITE_TEXTCAT_EDITOR: "0" | "1";
  VITE_LANGUAGES: string;
  VITE_LANGUAGE_VARIANTS: string;
  VITE_DEFAULT_LANG: string;
  VITE_DEEPL_LANGUAGES: string;
}
