import { buildProductSourceTree } from '#utils/prepareProductSourceTree.ts';
import { A5E } from '../../../../config.ts';

function getSourceFilterSection() {
	return {
		filterKey: 'source',
		heading: 'Source',
		type: 'sourceTree' as const,
		options: buildProductSourceTree(A5E.products, A5E.publishers, A5E.productLines),
	};
}

function getGenericConfig() {
	return [getSourceFilterSection()];
}

function getArchetypeFilterConfig() {
	return [
		{
			filterKey: 'class',
			heading: 'Class',
			options: CONFIG.A5E.classes,
		},
		getSourceFilterSection(),
	];
}

function getFeatureFilterConfig(filterSelections?: Record<string, any>) {
	const featSelected = filterSelections?.featureType?.inclusive?.includes('feat') ?? false;

	const newAbilityList = {
		none: 'A5E.None',
		...CONFIG.A5E.abilities,
		spellcasting: 'A5E.abilities.spellcasting',
	};

	const config: any[] = [
		{
			filterKey: 'featureType',
			heading: 'Feature Type',
			options: CONFIG.A5E.featureTypes,
		},
	];

	if (featSelected && CONFIG.A5E.synergies && Object.keys(CONFIG.A5E.synergies).length > 0) {
		config.push(
			{
				filterKey: 'asi',
				heading: 'ASI',
				options: newAbilityList,
			},
			{
				filterKey: 'featClasses',
				heading: 'A5E Class Prerequisites',
				options: CONFIG.A5E.classes,
			},
			{
				filterKey: 'featType',
				heading: 'Feat Type',
				options: CONFIG.A5E.featTypes,
			},
			{
				filterKey: 'synergy',
				heading: 'Synergy Chain',
				options: CONFIG.A5E.synergies,
			},
		);
	}

	config.push(
		{
			filterKey: 'classes',
			heading: 'Class',
			options: CONFIG.A5E.classes,
		},
		getSourceFilterSection(),
	);

	return config;
}

function getHackingFilterConfig() {
	return [
		{
			filterKey: 'diceCost',
			heading: 'Dice Cost Range',
			options: {
				min: 0,
				max: 5,
			},
			type: 'range',
		},
		{
			filterKey: 'source',
			heading: 'Source',
			options: PRODUCTS,
		},
	];
}

function getInteractionFilterConfig() {
	return [
		{
			filterKey: 'interactionType',
			heading: 'Interaction Type',
			options: CONFIG.A5E.interactionTypes,
		},
		getSourceFilterSection(),
	];
}

function getManeuverFilterConfig() {
	return [
		{
			filterKey: 'exertion',
			heading: 'Exertion Cost Range',
			options: {
				min: 0,
				max: 6,
			},
			type: 'range',
		},
		{
			filterKey: 'maneuverDegrees',
			heading: 'Maneuver Degrees',
			options: CONFIG.A5E.maneuverDegrees,
		},
		{
			filterKey: 'maneuverTraditions',
			heading: 'Maneuver Traditions',
			options: CONFIG.A5E.maneuverTraditions,
		},
		{
			filterKey: 'miscellaneous',
			heading: 'Miscellaneous',
			options: {
				concentration: 'Concentration',
				stance: 'Stance',
			},
		},
		getSourceFilterSection(),
	];
}

function getMonsterFilterConfig() {
	return [
		{
			filterKey: 'cr',
			heading: 'CR Range',
			options: {
				min: 0,
				max: 30,
			},
			type: 'range',
		},
		{
			filterKey: 'creatureTypes',
			heading: 'Creature Types',
			options: CONFIG.A5E.creatureTypes,
		},
		{
			filterKey: 'terrain',
			heading: 'Terrain',
			options: CONFIG.A5E.terrainTypes,
		},
		{
			filterKey: 'creatureSize',
			heading: 'Creature Size',
			options: CONFIG.A5E.actorSizes,
		},
		{
			filterKey: 'miscellaneous',
			heading: 'Miscellaneous',
			options: {
				elite: 'Elite',
				swarm: 'Swarm',
			},
		},
		getSourceFilterSection(),
	];
}

function getMonsterFeatureFilterConfig() {
	const featureTypeOptions = Object.fromEntries(
		Object.entries(CONFIG.A5E.featureTypes).filter(([key]) =>
			CONFIG.A5E.MONSTER_FEATURE_LIST.includes(key as any),
		),
	);

	return [
		{
			filterKey: 'featureType',
			heading: 'Feature Type',
			options: featureTypeOptions,
		},
		getSourceFilterSection(),
	];
}

function getObjectFilterConfig() {
	return [
		{
			filterKey: 'objectType',
			heading: 'Object Type',
			options: CONFIG.A5E.objectTypes,
		},
		{
			filterKey: 'rarity',
			heading: 'Item Rarity',
			options: CONFIG.A5E.itemRarity,
		},
		{
			filterKey: 'miscellaneous',
			heading: 'Miscellaneous',
			options: {
				bulky: 'Bulky',
				requiresAttunement: 'Requires Attunement',
			},
		},
		getSourceFilterSection(),
	];
}

function getSpellFilterConfig() {
	return [
		{
			filterKey: 'spellLists',
			heading: 'Spell Lists',
			options: CONFIG.A5E.classSpellLists,
		},
		{
			filterKey: 'spellLevels',
			heading: 'Spell Levels',
			options: CONFIG.A5E.spellLevels,
		},
		{
			filterKey: 'primarySpellSchools',
			heading: 'Primary Spell Schools',
			options: CONFIG.A5E.spellSchools.primary,
		},
		{
			filterKey: 'secondarySpellSchools',
			heading: 'Secondary Spell Schools',
			options: CONFIG.A5E.spellSchools.secondary,
		},
		{
			filterKey: 'components',
			heading: 'Components',
			options: CONFIG.A5E.spellComponents,
		},
		{
			filterKey: 'miscellaneous',
			heading: 'Miscellaneous',
			options: {
				concentration: 'Concentration',
				rare: 'Rare',
				ritual: 'Ritual',
			},
		},
		getSourceFilterSection(),
	];
}

export function getFilterConfig(documentType: string, filterSelections?: Record<string, any>) {
	if (documentType === 'archetype') return getArchetypeFilterConfig();
	if (documentType === 'feature') return getFeatureFilterConfig(filterSelections);
	if (documentType === 'hacking') return getHackingFilterConfig();
	if (documentType === 'interaction') return getInteractionFilterConfig();
	if (documentType === 'maneuver') return getManeuverFilterConfig();
	if (documentType === 'npc') return getMonsterFilterConfig();
	if (documentType === 'monsterFeature') return getMonsterFeatureFilterConfig();
	if (documentType === 'object') return getObjectFilterConfig();
	if (documentType === 'spell') return getSpellFilterConfig();
	return getGenericConfig();
}
