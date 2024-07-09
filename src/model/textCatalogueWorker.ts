import type { Lang } from "./language";
import { buildTextcat, type TextCatalogue } from "./textCatalogue";

type Input = {
  dirHandle: FileSystemDirectoryHandle | undefined;
  lang: Lang;
};

export interface BuildTextcatWorkerType
  extends Omit<Worker, "postMessage" | "onmessage"> {
  postMessage(command: Input): void;
  onmessage: ((this: Worker, ev: MessageEvent<TextCatalogue>) => void) | null;
}

self.onmessage = async (e: MessageEvent<Input>) => {
  console.debug("Worker got message", e.data);
  const file = `satzkatalog.${e.data.lang.toUpperCase()}.txt`;
  const catalogue = await buildTextcat(
    e.data.dirHandle || fetch(`./assets/${file}`),
    e.data.lang
  );
  postMessage(catalogue);
};
