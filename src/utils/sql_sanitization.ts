export const SqlSanitization = (value: string): string => {
  if (typeof value === "string") {
    const replacements: { [key: string]: string } = {
      "\0": "\\0",
      "\x08": "\\b",
      "\x09": "\\t",
      "\x1a": "\\z",
      "\n": "\\n",
      "\r": "\\r",
      '"': '\\"',
      "'": "\\'",
      "\\": "\\\\",
      "%": "\\%",
    };

    return value.replace(
      /[\0\x08\x09\x1a\n\r"'\\\%]/g,
      (char) => replacements[char] || char
    );
  }
  return value;
};
