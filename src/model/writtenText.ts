import { CurlyName, LANGUAGES, Lang } from ".";

export type Joker = {
  curlyName: "JOKER";
  line: 0;
  args: Record<Lang, string>;
};

export type WrittenPhrase =
  | {
      curlyName: CurlyName;
      line: number;
      args?: Record<CurlyName, WrittenPhrase>;
    }
  | Joker;

export function isJoker(writtenPhase: WrittenPhrase): writtenPhase is Joker {
  return (writtenPhase as Joker)?.curlyName === "JOKER";
}

export type WrittenText = WrittenPhrase[];

export interface WrittenTextProps {
  writtenPhrase: WrittenPhrase;
  setWrittenPhrase: (writtenPhrase: WrittenPhrase) => void;
}

export function newJoker(): Joker {
  return {
    curlyName: "JOKER",
    line: 0,
    args: Object.fromEntries(LANGUAGES.map(lang => [lang, ""])) as Record<
      Lang,
      string
    >
  };
}

export function newSentence(curlyName: CurlyName): WrittenPhrase {
  return {
    curlyName,
    line: 0
  };
}

export function newPhrase(curlyName: CurlyName, line = -1): WrittenPhrase {
  return {
    curlyName,
    line
  };
}

export function withPhrase(
  writtenPhrase: WrittenPhrase,
  newPhrase: WrittenPhrase
): WrittenPhrase {
  if (isJoker(writtenPhrase)) throw new Error();
  const args = {
    ...writtenPhrase.args,
    [newPhrase.curlyName]: newPhrase
  };
  if (newPhrase.line < 0) {
    delete args[newPhrase.curlyName];
  }
  return {
    ...writtenPhrase,
    args
  };
}

export function withLine(
  writtenPhrase: WrittenPhrase,
  line: number
): WrittenPhrase {
  if (isJoker(writtenPhrase)) throw new Error();
  return { ...writtenPhrase, line };
}

export function arrayMove<T>(
  arr: T[],
  fromIndex: number,
  toIndex?: number
): T[] {
  arr = [...arr];
  const element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  if (toIndex !== undefined) {
    arr.splice(toIndex, 0, element);
  }
  return arr;
}
