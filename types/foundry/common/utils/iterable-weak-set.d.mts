/**
 * Stores a set of objects with weak references to them, allowing them to be garbage collected. Can be iterated over,
 * unlike a WeakSet.
 */
export default class IterableWeakSet extends WeakSet<object> {
    /**
     * @param {Iterable<any>} [entries]  The initial entries.
     */
    constructor(entries?: Iterable<any>);
    /**
     * Add a value to the set.
     * @param {any} value  The value to add.
     * @returns {IterableWeakSet}
     */
    add(value: any): IterableWeakSet;
    /**
     * Delete a value from the set.
     * @param {any} value  The value to delete.
     * @returns {boolean}
     */
    delete(value: any): boolean;
    /**
     * Whether this set contains the given value.
     * @param {any} value  The value to test.
     * @returns {boolean}
     */
    has(value: any): boolean;
    /**
     * Enumerate the collection.
     * @returns {Generator<any, void, any>}
     */
    values(): Generator<any, void, any>;
    /**
     * Clear all values from the set.
     */
    clear(): void;
    /**
     * Enumerate the values.
     * @returns {Generator<any, void, any>}
     */
    [Symbol.iterator](): Generator<any, void, any>;
    #private;
}
