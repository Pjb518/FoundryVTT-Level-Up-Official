/**
 * Compares two arrays for exact equality. This helper is designed for checking the quality of
 * primitives, and will not work for arrays of objects, etc.
 *
 * Note that the order of elements is irrelevant as the provided arrays are sorted.
 *
 * Returns true is the two arrays are exactly equal, disregarding order.
 */
export default function arraysAreEqual(_a: any[], _b: any[]): boolean {
	if (!Array.isArray(_a) || !Array.isArray(_b)) return false;

	const a = Array.from(_a).sort();
	const b = Array.from(_b).sort();

	return a.length === b.length && a.every((val, index) => val === b[index]);
}
