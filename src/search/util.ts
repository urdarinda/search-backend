export const getTokensFromString = (s: string) =>
  s
    .toLowerCase()
    .replace(/[.,;:]/g, '')
    .trim()
    .split(' ');
