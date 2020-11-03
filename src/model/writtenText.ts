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
    line: -999
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
