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

export function newPhrase(curlyName: string): WrittenText {
  return {
    curlyName,
    line: -1
  };
}

export function existingOrNewPhrase(
  writtenText: WrittenText,
  curlyName: string
): WrittenText {
  return (
    writtenText?.args?.[curlyName] ?? {
      curlyName,
      line: -1
    }
  );
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

export function getPhrase(
  writtenText: WrittenText,
  curlyName: Identifier
): WrittenText {
  const phrase = writtenText?.args?.[curlyName];
  if (!phrase)
    throw new Error(`Unset phrase ${curlyName} in  ${writtenText.curlyName}!`);
  return phrase;
}
