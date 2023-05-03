/**
 * A helper function to determine if a range increment corresponds to one of the system's standard
 * ranges (e.g. 'short', 'long', 'touch', etc.)
 */
export default function isStandardRange(range: string): boolean {
  return range !== 'other' && Object.keys(CONFIG.A5E.rangeDescriptors).includes(range);
}
