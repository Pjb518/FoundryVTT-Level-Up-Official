export default Semaphore;
/**
 * A simple Semaphore implementation which provides a limited queue for ensuring proper concurrency.
 * @param {number} [max=1]    The maximum number of tasks which are allowed concurrently.
 *
 * @example Using a Semaphore
 * ```js
 * // Some async function that takes time to execute
 * function fn(x) {
 *   return new Promise(resolve => {
 *     setTimeout(() => {
 *       console.log(x);
 *       resolve(x);
 *     }, 1000));
 *   }
 * };
 *
 * // Create a Semaphore and add many concurrent tasks
 * const semaphore = new Semaphore(1);
 * for ( let i of Array.fromRange(100) ) {
 *   semaphore.add(fn, i);
 * }
 * ```
 */
declare class Semaphore {
    constructor(max?: number);
    /**
     * The maximum number of tasks which can be simultaneously attempted.
     * @type {number}
     */
    max: number;
    /**
     * A queue of pending function signatures
     * @type {Array<Array<Function|*>>}
     * @private
     */
    private _queue;
    /**
     * The number of tasks which are currently underway
     * @type {number}
     * @private
     */
    private _active;
    /**
     * The number of pending tasks remaining in the queue
     * @type {number}
     */
    get remaining(): number;
    /**
     * The number of actively executing tasks
     * @type {number}
     */
    get active(): number;
    /**
     * Add a new tasks to the managed queue
     * @param {Function} fn     A callable function
     * @param {...*} [args]     Function arguments
     * @returns {Promise}       A promise that resolves once the added function is executed
     */
    add(fn: Function, ...args?: any[]): Promise<any>;
    /**
     * Abandon any tasks which have not yet concluded
     */
    clear(): void;
    /**
     * Attempt to perform a task from the queue.
     * If all workers are busy, do nothing.
     * If successful, try again.
     * @private
     */
    private _try;
}
