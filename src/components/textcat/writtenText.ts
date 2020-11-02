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
