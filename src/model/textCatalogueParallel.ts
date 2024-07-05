import { type Lang, LANGUAGES } from "./language";
import { AllTextCatalogues, TextCatalogue } from "./textCatalogue";
import type { BuildTextcatWorkerType } from "./textCatalogueWorker";
import BuildTextcatWorker from "./textCatalogueWorker?worker";

export async function buildAllTextcat(
  dirHandle: FileSystemDirectoryHandle | undefined
): Promise<AllTextCatalogues> {
  const catalogues = Object.fromEntries(
    await Promise.all(LANGUAGES.map(lang => buildTextcat(lang)))
  ) as Record<Lang, TextCatalogue>;
  return new AllTextCatalogues(catalogues);

  function buildTextcat(lang: Lang): Promise<[Lang, TextCatalogue]> {
    return new Promise((resolve, reject) => {
      const worker: BuildTextcatWorkerType = new BuildTextcatWorker();
      worker.onerror = e => reject(e);
      worker.onmessage = e => {
        console.debug("Coordinator got message", e.data);
        const catalogue = new TextCatalogue(lang);
        Object.assign(catalogue, e.data);
        return resolve([lang, catalogue]);
      };
      worker.postMessage({ dirHandle, lang });
    });
  }
}
