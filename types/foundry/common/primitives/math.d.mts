/**
 * Bound a number between some minimum and maximum value, inclusively.
 * @param {number} num    The current value
 * @param {number} min    The minimum allowed value
 * @param {number} max    The maximum allowed value
 * @return {number}       The clamped number
 * @memberof Math
 */
export function clamp(num: number, min: number, max: number): number;
/**
 * @deprecated since v12
 * @ignore
 */
export function clamped(num: any, min: any, max: any): number;
/**
 * Linear interpolation function
 * @param {number} a   An initial value when weight is 0.
 * @param {number} b   A terminal value when weight is 1.
 * @param {number} w   A weight between 0 and 1.
 * @return {number}    The interpolated value between a and b with weight w.
 */
export function mix(a: number, b: number, w: number): number;
/**
 * Transform an angle in degrees to be bounded within the domain [0, 360)
 * @param {number} degrees  An angle in degrees
 * @returns {number}        The same angle on the range [0, 360)
 */
export function normalizeDegrees(degrees: number, base: any): number;
/**
 * Transform an angle in radians to be bounded within the domain [-PI, PI]
 * @param {number} radians  An angle in degrees
 * @return {number}         The same angle on the range [-PI, PI]
 */
export function normalizeRadians(radians: number): number;
/**
 * @deprecated since v12
 * @ignore
 */
export function roundDecimals(number: any, places: any): number;
/**
 * Transform an angle in radians to a number in degrees
 * @param {number} angle    An angle in radians
 * @return {number}         An angle in degrees
 */
export function toDegrees(angle: number): number;
/**
 * Transform an angle in degrees to an angle in radians
 * @param {number} angle    An angle in degrees
 * @return {number}         An angle in radians
 */
export function toRadians(angle: number): number;
/**
 * Returns the value of the oscillation between `a` and `b` at time `t`.
 * @param {number} a                              The minimium value of the oscillation
 * @param {number} b                              The maximum value of the oscillation
 * @param {number} t                              The time
 * @param {number} [p=1]                          The period (must be nonzero)
 * @param {(x: number) => number} [f=Math.cos]    The periodic function (its period must be 2π)
 * @returns {number}                              `((b - a) * (f(2π * t / p) + 1) / 2) + a`
 */
export function oscillation(a: number, b: number, t: number, p?: number, f?: (x: number) => number): number;
/**
 * √3
 * @type {number}
 */
export const SQRT3: number;
/**
 * √⅓
 * @type {number}
 */
export const SQRT1_3: number;
