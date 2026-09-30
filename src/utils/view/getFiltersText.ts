import type { SpellGrant } from '#data/item/Grants/SpellGrant.ts';

export function getFiltersText(grant: SpellGrant) {
	const filters = Object.values(grant.config.pool.filters ?? {});
	let count = 0;

	filters.forEach((f) => {
		count += f.inclusive?.length ?? 0;
		count += f.exclusive?.length ?? 0;
	});

	if (count === 0) return 'No Filters Selected.';
	if (count === 1) return '1 Filter Selected.';
	return `${count} Filters Selected.`;
}
