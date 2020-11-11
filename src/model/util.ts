export function longestCommonPrefix(...strings: string[]): string {
  if (strings.length === 0) {
    return "";
  }
  return strings.reduce((s1, s2) => {
    let i = 0;
    while (s1[i] && s2[i] && s1[i] === s2[i]) {
      i++;
    }
    return s1.slice(0, i);
  });
}
