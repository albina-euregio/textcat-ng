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
  const catalogue = await buildTextcat(e.data.dirHandle, e.data.lang);
  postMessage(catalogue);
};
