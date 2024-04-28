/**
 * Test whether a Date instance is valid.
 * A valid date returns a number for its timestamp, and NaN otherwise.
 * NaN is never equal to itself.
 * @returns {boolean}
 */
export function isValid(): boolean;
/**
 * Return a standard YYYY-MM-DD string for the Date instance.
 * @returns {string}    The date in YYYY-MM-DD format
 */
export function toDateInputString(): string;
/**
 * Return a standard H:M:S.Z string for the Date instance.
 * @returns {string}    The time in H:M:S format
 */
export function toTimeInputString(): string;
