import { Identifier } from ".";

export interface WrittenText {
  curlyName: Identifier;
  line: number;
  args?: Record<Identifier, WrittenText>;
}

export interface WrittenTextProps {
  writtenText: WrittenText;
  setWrittenText: (writtenText: WrittenText) => void;
}

export function newSentence(curlyName: string): WrittenText {
  return {
    curlyName,
    line: 0
  };
}

export function newPhrase(curlyName: string, line = -1): WrittenText {
  return {
    curlyName,
    line
  };
}

export function withPhrase(
  writtenText: WrittenText,
  newPhrase: WrittenText
): WrittenText {
  return {
    ...writtenText,
    args: {
      ...writtenText.args,
      [newPhrase.curlyName]: newPhrase
    }
  };
}

export function withLine(writtenText: WrittenText, line: number): WrittenText {
  return { ...writtenText, line };
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
