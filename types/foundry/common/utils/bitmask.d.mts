/**
 * Create a new BitMask instance.
 * @param {Object<string, boolean>} [states=null] An object containing valid states and their corresponding initial boolean values (default is null).
 */
export default class BitMask extends Number {
    /**
     * Creates a new BitMask instance from a JSON string.
     * @param {string} jsonString The JSON string representing the bitmask.
     * @returns {BitMask} A new BitMask instance created from the JSON string.
     */
    static fromJSON(jsonString: string): BitMask;
    /**
     * Generates shader constants based on the provided states.
     * @param {string[]} states An array containing valid states.
     * @returns {string} Shader bit mask constants generated from the states.
     */
    static generateShaderBitMaskConstants(states: string[]): string;
    /**
     * The enum associated with this structure.
     * @type {Object<string, string>}
     * @readonly
     */
    readonly states: {
        [x: string]: string;
    };
    /**
     * True if this bitmask is empty (no active states).
     * @type {boolean}
     */
    get isEmpty(): boolean;
    /**
     * Check if a specific state is active.
     * @param {string} state The state to check.
     * @returns {boolean} True if the state is active, false otherwise.
     */
    hasState(state: string): boolean;
    /**
     * Add a state to the bitmask.
     * @param {string} state The state to add.
     * @throws {Error} Throws an error if the provided state is not valid.
     */
    addState(state: string): void;
    /**
     * Remove a state from the bitmask.
     * @param {string} state The state to remove.
     * @throws {Error} Throws an error if the provided state is not valid.
     */
    removeState(state: string): void;
    /**
     * Toggle the state of a specific state in the bitmask.
     * @param {string} state The state to toggle.
     * @param {boolean} [enabled] Toggle on (true) or off (false)? If undefined, the state is switched automatically.
     * @throws {Error} Throws an error if the provided state is not valid.
     */
    toggleState(state: string, enabled?: boolean): number;
    /**
     * Clear the bitmask, setting all states to inactive.
     */
    clear(): void;
    /**
     * Get a string representation of the bitmask in binary format.
     * @returns {string} The string representation of the bitmask.
     */
    toString(): string;
    /**
     * Checks if two bitmasks structures are compatible (the same valid states).
     * @param {BitMask} otherBitMask The bitmask structure to compare with.
     * @returns {boolean} True if the two bitmasks have the same structure, false otherwise.
     */
    isCompatible(otherBitMask: BitMask): boolean;
    /**
     * Serializes the bitmask to a JSON string.
     * @returns {string} The JSON string representing the bitmask.
     */
    toJSON(): string;
    /**
     * Convert value of this BitMask to object representation according to structure.
     * @returns {Object} The data represented by the bitmask.
     */
    toObject(): any;
    /**
     * Creates a clone of this BitMask instance.
     * @returns {BitMask} A new BitMask instance with the same value and valid states as this instance.
     */
    clone(): BitMask;
    #private;
}
