// @ts-nocheck

export type HomebrewPath =
	| 'damageTypes'
	| 'languages'
	| 'objectTypes'
	| 'spellSchools.primary'
	| 'spellSchools.secondary'
	| 'proficiencies.armor'
	| 'proficiencies.tradition'
	| 'proficiencies.tool'
	| 'proficiencies.weapon';

export const CATEGORIZED_PATHS: HomebrewPath[] = ['proficiencies.tool', 'proficiencies.weapon'];

export function getDefaultHomebrewContent() {
	return {
		damageTypes: {},
		languages: {},
		objectTypes: {},
		spellSchools: { primary: {}, secondary: {} },
		proficiencies: { armor: {}, tradition: {}, tool: {}, weapon: {} },
	};
}

export function normalizeHomebrewContent(data: Record<string, any> = {}) {
	const defaults = getDefaultHomebrewContent();

	return {
		damageTypes: { ...data?.damageTypes },
		languages: { ...data?.languages },
		objectTypes: { ...data?.objectTypes },
		spellSchools: { ...defaults.spellSchools, ...data?.spellSchools },
		proficiencies: { ...defaults.proficiencies, ...data?.proficiencies },
	};
}

export function getConfigTargets(path: HomebrewPath, category?: string): Record<string, string>[] {
	const config = CONFIG.A5E;

	switch (path) {
		case 'damageTypes':
			return [config.damageTypes];
		case 'languages':
			return [config.languages];
		case 'objectTypes':
			return [config.objectTypes, config.objectTypesPlural];
		case 'spellSchools.primary':
			return [config.spellSchools.primary];
		case 'spellSchools.secondary':
			return [config.spellSchools.secondary];
		case 'proficiencies.armor':
			return [config.armor];
		case 'proficiencies.tradition':
			return [config.maneuverTraditions];
		case 'proficiencies.tool':
			config.tools[category] ??= {};
			config.toolsPlural[category] ??= {};
			return [config.tools[category], config.toolsPlural[category]];
		case 'proficiencies.weapon':
			config.weapons[category] ??= {};
			config.weaponsPlural[category] ??= {};
			return [config.weapons[category], config.weaponsPlural[category]];
		default:
			return [];
	}
}

export function getHomebrewBucket(
	data: Record<string, any>,
	path: HomebrewPath,
	category?: string,
	create = false,
) {
	const [root, sub] = path.split('.');
	const branch = sub ? data[root][sub] : data[root];

	if (!CATEGORIZED_PATHS.includes(path)) return branch;
	if (create) return (branch[category] ??= {});
	return branch[category] ?? {};
}

export function getExistingKeys(path: HomebrewPath): Set<string> {
	const config = CONFIG.A5E;
	let objects: Record<string, string>[];

	if (path === 'proficiencies.tool') objects = Object.values(config.tools);
	else if (path === 'proficiencies.weapon') objects = Object.values(config.weapons);
	else objects = [getConfigTargets(path)[0]];

	return new Set(objects.flatMap((object) => Object.keys(object).map((key) => key.toLowerCase())));
}

function writeEntries(path: HomebrewPath, entries: Record<string, string>, category?: string) {
	for (const target of getConfigTargets(path, category)) Object.assign(target, entries);

	if (path === 'proficiencies.tool') Object.assign(CONFIG.A5E.toolsFlattened, entries);
}

export default function applyHomebrewEntries(rawData: Record<string, any>) {
	const data = normalizeHomebrewContent(rawData);

	writeEntries('damageTypes', data.damageTypes);
	writeEntries('languages', data.languages);
	writeEntries('objectTypes', data.objectTypes);
	writeEntries('spellSchools.primary', data.spellSchools.primary);
	writeEntries('spellSchools.secondary', data.spellSchools.secondary);
	writeEntries('proficiencies.armor', data.proficiencies.armor);
	writeEntries('proficiencies.tradition', data.proficiencies.tradition);

	for (const path of CATEGORIZED_PATHS) {
		const type = path.split('.')[1];

		for (const [category, entries] of Object.entries(data.proficiencies[type])) {
			writeEntries(path, entries, category);
		}
	}
}

export function addConfigEntries(
	path: HomebrewPath,
	entries: Record<string, string>,
	category?: string,
) {
	writeEntries(path, entries, category);
}

export function removeConfigEntry(path: HomebrewPath, key: string, category?: string) {
	for (const target of getConfigTargets(path, category)) delete target[key];

	if (path === 'proficiencies.tool') {
		const stillUsed = Object.values(CONFIG.A5E.tools).some((tools) => key in tools);
		if (!stillUsed) delete CONFIG.A5E.toolsFlattened[key];
	}
}
