/**
 * Log a compatibility warning which is filtered based on the client's defined compatibility settings.
 * @param {string} message            The original warning or error message
 * @param {object} [options={}]       Additional options which customize logging
 * @param {number} [options.mode]           A logging level in COMPATIBILITY_MODES which overrides the configured default
 * @param {number|string} [options.since]   A version identifier since which a change was made
 * @param {number|string} [options.until]   A version identifier until which a change remains supported
 * @param {string} [options.details]        Additional details to append to the logged message
 * @param {boolean} [options.stack=true]    Include the message stack trace
 * @param {boolean} [options.once=false]    Log this the message only once?
 * @throws                            An Error if the mode is ERROR
 */
export function logCompatibilityWarning(message: string, { mode, since, until, details, stack, once }?: {
    mode?: number;
    since?: number | string;
    until?: number | string;
    details?: string;
    stack?: boolean;
    once?: boolean;
}): void;
