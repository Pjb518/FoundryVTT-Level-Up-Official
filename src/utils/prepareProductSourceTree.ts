import type { ProductEntry } from '../config/premiumContent/data.ts';

export type ProductOption = [key: string, title: string];

export interface ProductLineGroup {
	key: string;
	label: string;
	keys: string[];
	options: ProductOption[];
}

export interface PublisherGroup {
	key: string;
	label: string;
	keys: string[];
	standalone: ProductOption[];
	productLines: ProductLineGroup[];
}

export interface ProductSourceTree {
	ungrouped: ProductOption[];
	publishers: PublisherGroup[];
}

export type GroupSelectionState = 'all' | 'some' | 'none';
export type GroupTriState = 'inclusive' | 'exclusive' | 'mixed' | 'none';

export function compareText(a: string, b: string): number {
	return a.localeCompare(b, undefined, { numeric: true });
}

export function groupByKey<T>(
	entries: T[],
	keyFn: (entry: T) => string | undefined,
): { ungrouped: T[]; byKey: Map<string, T[]> } {
	const ungrouped: T[] = [];
	const byKey = new Map<string, T[]>();
	for (const entry of entries) {
		const key = keyFn(entry);
		if (!key) {
			ungrouped.push(entry);
			continue;
		}
		const group = byKey.get(key) ?? [];
		group.push(entry);
		byKey.set(key, group);
	}
	return { ungrouped, byKey };
}

export function sortByDisplayName<T>(
	map: Map<string, T[]>,
	displayNames: Record<string, string>,
): [string, T[]][] {
	return [...map.entries()].sort(([a], [b]) =>
		compareText(displayNames[a] ?? a, displayNames[b] ?? b),
	);
}

function toOptions(entries: [string, ProductEntry][]): ProductOption[] {
	return entries
		.map(([key, product]): ProductOption => [key, product.title])
		.sort((a, b) => compareText(a[1], b[1]));
}

export function buildProductSourceTree(
	products: Record<string, ProductEntry>,
	publishers: Record<string, string>,
	productLines: Record<string, string>,
): ProductSourceTree {
	const entries = Object.entries(products).filter(([, product]) => !product.excludeFromFilters);

	const { ungrouped, byKey: byPublisher } = groupByKey(entries, ([, product]) => product.publisher);

	const publisherGroups: PublisherGroup[] = sortByDisplayName(byPublisher, publishers).map(
		([publisherKey, publisherEntries]) => {
			const { ungrouped: standaloneEntries, byKey: byProductLine } = groupByKey(
				publisherEntries,
				([, product]) => product.productLine,
			);

			const productLineGroups: ProductLineGroup[] = sortByDisplayName(
				byProductLine,
				productLines,
			).map(([lineKey, lineEntries]) => ({
				key: lineKey,
				label: productLines[lineKey] ?? lineKey,
				keys: lineEntries.map(([key]) => key),
				options: toOptions(lineEntries),
			}));

			const standalone = toOptions(standaloneEntries);

			return {
				key: publisherKey,
				label: publishers[publisherKey] ?? publisherKey,
				keys: [
					...standaloneEntries.map(([key]) => key),
					...productLineGroups.flatMap((line) => line.keys),
				],
				standalone,
				productLines: productLineGroups,
			};
		},
	);

	return { ungrouped: toOptions(ungrouped), publishers: publisherGroups };
}

export function getGroupSelectionState(
	keys: string[],
	primary: string[],
	secondary: string[] = [],
): GroupSelectionState {
	if (keys.length === 0) return 'none';
	if (keys.every((key) => primary.includes(key))) return 'all';
	if (keys.some((key) => primary.includes(key) || secondary.includes(key))) return 'some';
	return 'none';
}

export function toggleGroupInList(keys: string[], selected: string[]): string[] {
	if (getGroupSelectionState(keys, selected) === 'all') {
		return selected.filter((key) => !keys.includes(key));
	}
	return [...new Set([...selected, ...keys])];
}

/** Whether a group's keys are fully inclusive, fully exclusive, a mix of the two/partial, or unselected. */
export function getGroupTriState(
	keys: string[],
	inclusive: string[],
	exclusive: string[],
): GroupTriState {
	if (keys.length === 0) return 'none';
	if (keys.every((key) => inclusive.includes(key))) return 'inclusive';
	if (keys.every((key) => exclusive.includes(key))) return 'exclusive';
	if (keys.some((key) => inclusive.includes(key) || exclusive.includes(key))) return 'mixed';
	return 'none';
}

/**
 * Cycles a group's keys through the same three states an individual product tag cycles through on
 * repeated clicks: unselected -> inclusive -> exclusive -> unselected. A group that isn't uniformly
 * in one state (mixed, or only partially selected) is treated as the starting point, so clicking it
 * first brings every key to inclusive before continuing the cycle.
 */
export function toggleGroupInTriState(
	keys: string[],
	selected: [string[], string[]],
): [string[], string[]] {
	const [inclusive, exclusive] = selected;
	const state = getGroupTriState(keys, inclusive, exclusive);

	if (state === 'inclusive') {
		return [inclusive.filter((key) => !keys.includes(key)), [...new Set([...exclusive, ...keys])]];
	}

	if (state === 'exclusive') {
		return [inclusive, exclusive.filter((key) => !keys.includes(key))];
	}

	return [[...new Set([...inclusive, ...keys])], exclusive.filter((key) => !keys.includes(key))];
}
