/**
 * Capitalize a string, transforming it's first character to a capital letter.
 * @returns {string}
 */
export function capitalize(): string;
/**
 * Compare this string (x) with the other string (y) by comparing each character's Unicode code point value.
 * Returns a negative Number if x < y, a positive Number if x > y, or a zero otherwise.
 * This is the same comparision function that used by Array#sort if the compare function argument is omitted.
 * The result is host/locale-independent.
 * @param {string} other    The other string to compare this string to.
 * @returns {number}
 */
export function compare(other: string): number;
/**
 * Convert a string to Title Case where the first letter of each word is capitalized.
 * @returns {string}
 */
export function titleCase(): string;
/**
 * Strip any script tags which were included within a provided string.
 * @returns {string}
 */
export function stripScripts(): string;
/**
 * Transform any string into an url-viable slug string
 * @param {object} [options]      Optional arguments which customize how the slugify operation is performed
 * @param {string} [options.replacement="-"]  The replacement character to separate terms, default is '-'
 * @param {boolean} [options.strict=false]    Replace all non-alphanumeric characters, or allow them? Default false
 * @param {boolean} [options.lowercase=true]  Lowercase the string.
 * @returns {string}              The slugified input string
 */
export function slugify({ replacement, strict, lowercase }?: {
    replacement?: string;
    strict?: boolean;
    lowercase?: boolean;
}): string;
