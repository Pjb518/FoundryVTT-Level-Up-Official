type GroupedBy<T, K extends keyof T> = {
	[P in T[K] & PropertyKey]?: Extract<T, Record<K, P>>[];
};

function groupBy<T, K extends keyof T>(items: T[], key: K): GroupedBy<T, K> {
	return Object.groupBy(items, (item) => item[key] as PropertyKey) as GroupedBy<T, K>;
}

export { groupBy };
