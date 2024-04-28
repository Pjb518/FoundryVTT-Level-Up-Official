/**
 * A wrapper method around `fetch` that attaches an AbortController signal to the `fetch` call for clean timeouts
 * @see https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal#aborting_a_fetch_with_timeout_or_explicit_abort
 * @param {string} url            The URL to make the Request to
 * @param {Object} data           The data of the Request
 * @param {number|null} timeoutMs How long to wait for a Response before cleanly aborting.
 *                                If null, no timeout is applied
 * @param {function} onTimeout    A method to invoke if and when the timeout is reached
 * @return {Promise<Response>}
 * @throws {HttpError}
 */
export function fetchWithTimeout(url: string, data?: any, { timeoutMs, onTimeout }?: number | null): Promise<Response>;
/**
 * A small wrapper that automatically asks for JSON with a Timeout
 * @param {string} url          The URL to make the Request to
 * @param {Object} data         The data of the Request
 * @param {int} timeoutMs       How long to wait for a Response before cleanly aborting
 * @param {function} onTimeout  A method to invoke if and when the timeout is reached
 * @returns {Promise<*>}
 */
export function fetchJsonWithTimeout(url: string, data?: any, { timeoutMs, onTimeout }?: int): Promise<any>;
/**
 * Represents an HTTP Error when a non-OK response is returned by Fetch
 * @extends {Error}
 */
export class HttpError extends Error {
    constructor(statusText: any, code: any, displayMessage?: string);
    code: any;
    displayMessage: string;
}
