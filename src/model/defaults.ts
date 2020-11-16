import { Lang } from "./";
import { WrittenPhrase } from "./writtenText";

export function defaultLang(): Lang {
  return "de";
}
export function defaultNewSentenceCurlyName(): string {
  return "Verhältnisse01";
}

export function defaultWrittenPhrase(): WrittenPhrase {
  return {
    curlyName: "Verhältnisse04",
    line: 0,
    args: {
      "Verhältnisse04§wo_wann3": {
        curlyName: "Verhältnisse04§wo_wann3",
        line: 2
      },
      // eslint-disable-next-line @typescript-eslint/camelcase
      teils_gefährliche: {
        curlyName: "teils_gefährliche",
        line: 1,
        args: {
          zeitweise: {
            curlyName: "zeitweise",
            line: 1
          },
          gefährliche: {
            curlyName: "gefährliche",
            line: 2
          }
        }
      }
    }
  };
}
