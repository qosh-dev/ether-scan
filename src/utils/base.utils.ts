export const BaseUtils = {
  async wait(milliseconds: number): Promise<boolean> {
    return new Promise((res) => {
      const timeout = setTimeout(() => {
        clearTimeout(timeout);
        res(true);
      }, milliseconds);
    });
  },
  /**
   * Rounds a number to a specified number of decimal places.
   * @param {number} number - The number to be rounded
   * @param {number} [fractionDigits=2] - The number of decimal places to round to (default is 2)
   */
  fixedNumber(number: number, fractionDigits = 2) {
    return Number(number.toFixed(fractionDigits));
  },
  objectToText: (obj: { [n in string]: number | string | boolean }) => {
    let text = '';
    text += Object.keys(obj).reduce((s, k) => (s += `${k} : ${obj[k]}\n`), '');
    text += '\n';
    return text;
  },
};
