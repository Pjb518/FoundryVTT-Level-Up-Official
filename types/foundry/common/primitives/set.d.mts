/**
 * Return the difference of two sets.
 * @param {Set} other       Some other set to compare against
 * @returns {Set}           The difference defined as objects in this which are not present in other
 */
export function difference(other: Set<any>): Set<any>;
/**
 * Return the symmetric difference of two sets.
 * @param {Set} other  Another set.
 * @returns {Set}      The set of elements that exist in this or other, but not both.
 */
export function symmetricDifference(other: Set<any>): Set<any>;
/**
 * Test whether this set is equal to some other set.
 * Sets are equal if they share the same members, independent of order
 * @param {Set} other       Some other set to compare against
 * @returns {boolean}       Are the sets equal?
 */
export function equals(other: Set<any>): boolean;
/**
 * Return the first value from the set.
 * @returns {*}             The first element in the set, or undefined
 */
export function first(): any;
/**
 * Return the intersection of two sets.
 * @param {Set} other       Some other set to compare against
 * @returns {Set}           The intersection of both sets
 */
export function intersection(other: Set<any>): Set<any>;
/**
 * Test whether this set has an intersection with another set.
 * @param {Set} other       Another set to compare against
 * @returns {boolean}       Do the sets intersect?
 */
export function intersects(other: Set<any>): boolean;
/**
 * Return the union of two sets.
 * @param {Set} other  The other set.
 * @returns {Set}
 */
export function union(other: Set<any>): Set<any>;
/**
 * Test whether this set is a subset of some other set.
 * A set is a subset if all its members are also present in the other set.
 * @param {Set} other       Some other set that may be a subset of this one
 * @returns {boolean}       Is the other set a subset of this one?
 */
export function isSubset(other: Set<any>): boolean;
/**
 * Convert a set to a JSON object by mapping its contents to an array
 * @returns {Array}           The set elements as an array.
 */
export function toObject(): any[];
/**
 * Test whether every element in this Set satisfies a certain test criterion.
 * @see Array#every
 * @param {function(*,number,Set): boolean} test   The test criterion to apply. Positional arguments are the value,
 * the index of iteration, and the set being tested.
 * @returns {boolean}  Does every element in the set satisfy the test criterion?
 */
export function every(test: (arg0: any, arg1: number, arg2: Set<any>) => boolean): boolean;
/**
 * Filter this set to create a subset of elements which satisfy a certain test criterion.
 * @see Array#filter
 * @param {function(*,number,Set): boolean} test  The test criterion to apply. Positional arguments are the value,
 * the index of iteration, and the set being filtered.
 * @returns {Set}  A new Set containing only elements which satisfy the test criterion.
 */
export function filter(test: (arg0: any, arg1: number, arg2: Set<any>) => boolean): Set<any>;
/**
 * Find the first element in this set which satisfies a certain test criterion.
 * @see Array#find
 * @param {function(*,number,Set): boolean} test  The test criterion to apply. Positional arguments are the value,
 * the index of iteration, and the set being searched.
 * @returns {*|undefined}  The first element in the set which satisfies the test criterion, or undefined.
 */
export function find(test: (arg0: any, arg1: number, arg2: Set<any>) => boolean): any | undefined;
/**
 * Create a new Set where every element is modified by a provided transformation function.
 * @see Array#map
 * @param {function(*,number,Set): boolean} transform  The transformation function to apply.Positional arguments are
 * the value, the index of iteration, and the set being transformed.
 * @returns {Set}  A new Set of equal size containing transformed elements.
 */
export function map(transform: (arg0: any, arg1: number, arg2: Set<any>) => boolean): Set<any>;
/**
 * Create a new Set with elements that are filtered and transformed by a provided reducer function.
 * @see Array#reduce
 * @param {function(*,*,number,Set): *} reducer  A reducer function applied to each value. Positional
 * arguments are the accumulator, the value, the index of iteration, and the set being reduced.
 * @param {*} accumulator       The initial value of the returned accumulator.
 * @returns {*}                 The final value of the accumulator.
 */
export function reduce(reducer: (arg0: any, arg1: any, arg2: number, arg3: Set<any>) => any, accumulator: any): any;
/**
 * Test whether any element in this Set satisfies a certain test criterion.
 * @see Array#some
 * @param {function(*,number,Set): boolean} test   The test criterion to apply. Positional arguments are the value,
 * the index of iteration, and the set being tested.
 * @returns {boolean}         Does any element in the set satisfy the test criterion?
 */
export function some(test: (arg0: any, arg1: number, arg2: Set<any>) => boolean): boolean;
