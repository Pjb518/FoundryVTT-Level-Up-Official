/**
 * Test for near-equivalence of two numbers within some permitted epsilon
 * @param {number} n      Some other number
 * @param {number} e      Some permitted epsilon, by default 1e-8
 * @returns {boolean}     Are the numbers almost equal?
 */
export function almostEqual(n: number, e?: number): boolean;
/**
 * Transform a number to an ordinal string representation. i.e.
 * 1 => 1st
 * 2 => 2nd
 * 3 => 3rd
 * @returns {string}
 */
export function ordinalString(): string;
/**
 * Return a string front-padded by zeroes to reach a certain number of numeral characters
 * @param {number} digits     The number of characters desired
 * @returns {string}          The zero-padded number
 */
export function paddedString(digits: number): string;
/**
 * Return a string prefaced by the sign of the number (+) or (-)
 * @returns {string}          The signed number as a string
 */
export function signedString(): string;
/**
 * Round a number to the closest number which is a multiple of the provided interval.
 * This is a convenience function intended to humanize issues of floating point precision.
 * The interval is treated as a standard string representation to determine the amount of decimal truncation applied.
 * @param {number} interval       The interval to round the number to the nearest multiple of
 * @param {string} [method=round] The rounding method in: round, ceil, floor
 * @returns {number}              The rounded number
 *
 * @example Round a number to the nearest step interval
 * ```js
 * let n = 17.18;
 * n.toNearest(5); // 15
 * n.toNearest(10); // 20
 * n.toNearest(10, "floor"); // 10
 * n.toNearest(10, "ceil"); // 20
 * n.toNearest(0.25); // 17.25
 * ```
 */
export function toNearest(interval?: number, method?: string): number;
/**
 * A faster numeric between check which avoids type coercion to the Number object.
 * Since this avoids coercion, if non-numbers are passed in unpredictable results will occur. Use with caution.
 * @param {number} a            The lower-bound
 * @param {number} b            The upper-bound
 * @param {boolean} inclusive   Include the bounding values as a true result?
 * @return {boolean}            Is the number between the two bounds?
 */
export function between(a: number, b: number, inclusive?: boolean): boolean;
/**
 * Test whether a value is numeric.
 * This is the highest performing algorithm currently available, per https://jsperf.com/isnan-vs-typeof/5
 * @memberof Number
 * @param {*} n       A value to test
 * @return {boolean}  Is it a number?
 */
export function isNumeric(n: any): boolean;
/**
 * Attempt to create a number from a user-provided string.
 * @memberof Number
 * @param {string|number} n   The value to convert; typically a string, but may already be a number.
 * @return {number}           The number that the string represents, or NaN if no number could be determined.
 */
export function fromString(n: string | number): number;
