/**
 * A helper function for validating individual terms in a roll formula so that targeted error
 * messages can be provided to the user in various dialog windows.
 *
 * The function accepts an array of objects, each containing a value to test and an error message
 * for if that value fails validation.
 *
 * Returns array of error messages resulting from validating the terms.
 */
export default function validateTerms(terms: object[]): string[] {
  return terms.reduce((errors, { value, message }) => {
    try {
      if (value && !Roll.validate(value.toString())) throw Error(message);
    } catch (err) {
      errors.push(err.message);
    }

    return errors;
  }, []);
}
