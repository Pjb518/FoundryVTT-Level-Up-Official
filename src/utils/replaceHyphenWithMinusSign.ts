/**
 * This utility function naïvely replaces all instances of '-' with U+2212. It is designed to
 * improve the display of negative numbers on character sheets. This should not be used to replace
 * any values that may be fed to a Foundry Roll object, as Foundry will fail to parse the formula.
 *
 * @param number A string or numeric representation of a number.
 * @returns A new string with all instance of '-' replaced with a true minus sign.
 */
export default function replaceHyphenWithMinusSign(number: (String | Number)) {
  const stringForm = number.toString();
  return stringForm.replaceAll('-', '\u2212');
}
