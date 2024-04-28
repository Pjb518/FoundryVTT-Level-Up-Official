/**
 * Stores a map of objects with weak references to the keys, allowing them to be garbage collected. Both keys and values
 * can be iterated over, unlike a WeakMap.
 */
export default class IterableWeakMap extends WeakMap<object, any> {
    /**
     * Clean up the corresponding ref in the set when its value is garbage collected.
     * @param {IterableWeakMapHeldValue} heldValue  The value held by the finalizer.
     */
    static "__#5@#cleanup"({ set, ref }: {
        /**
         * The set to be cleaned.
         */
        set: Set<WeakRef<any>>;
        /**
         * The ref to remove.
         */
        ref: WeakRef<any>;
    }): void;
    /**
     * @param {Iterable<[any, any]>} [entries]  The initial entries.
     */
    constructor(entries?: Iterable<[any, any]>);
    /**
     * Remove a key from the map.
     * @param {any} key  The key to remove.
     * @returns {boolean}
     */
    delete(key: any): boolean;
    /**
     * Retrieve a value from the map.
     * @param {any} key  The value's key.
     * @returns {any}
     */
    get(key: any): any;
    /**
     * Place a value in the map.
     * @param {any} key    The key.
     * @param {any} value  The value.
     * @returns {IterableWeakMap}
     */
    set(key: any, value: any): IterableWeakMap;
    /**
     * Clear all values from the map.
     */
    clear(): void;
    /**
     * Enumerate the entries.
     * @returns {Generator<[any, any], void, any>}
     */
    entries(): Generator<[any, any], void, any>;
    /**
     * Enumerate the keys.
     * @returns {Generator<any, void, any>}
     */
    keys(): Generator<any, void, any>;
    /**
     * Enumerate the values.
     * @returns {Generator<any, void, any>}
     */
    values(): Generator<any, void, any>;
    /**
     * Enumerate the entries.
     * @returns {Generator<[any, any], void, any>}
     */
    [Symbol.iterator](): Generator<[any, any], void, any>;
    #private;
}
