import { Identifier } from ".";

export interface WrittenPhrase {
  curlyName: Identifier;
  line: number;
  args?: Record<Identifier, WrittenPhrase>;
}

export type WrittenText = WrittenPhrase[];

export interface WrittenTextProps {
  writtenPhrase: WrittenPhrase;
  setWrittenPhrase: (writtenPhrase: WrittenPhrase) => void;
}

export function newSentence(curlyName: string): WrittenPhrase {
  return {
    curlyName,
    line: 0
  };
}

export function newPhrase(curlyName: string, line = -1): WrittenPhrase {
  return {
    curlyName,
    line
  };
}

export function withPhrase(
  writtenPhrase: WrittenPhrase,
  newPhrase: WrittenPhrase
): WrittenPhrase {
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
