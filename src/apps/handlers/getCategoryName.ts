/* eslint-disable no-param-reassign */
/* eslint-disable eqeqeq */
function getCRLabel(cr: string | number): string {
	if (cr == 0.125) return 'CR ⅛';
	if (cr == 0.25) return 'CR ¼';
	if (cr == 0.5) return 'CR ½';

	return `CR ${cr}`;
}

function getManueverDegreeLabel(level: string | number): string {
	if (level == 0) return 'Basic Maneuvers';

	// eslint-disable-next-line no-param-reassign
	if (typeof level === 'string') level = parseInt(level, 10);

	// eslint-disable-next-line no-param-reassign
	level = Number.isNaN(level) ? (1).ordinalString() : level.ordinalString();
	return `${level} Degree Maneuvers`;
}

function getRarityLabel(rarity: string | number): string {
	if (typeof rarity === 'string') return `${rarity.capitalize()} Items`;
	return `${rarity.toString().capitalize()} Items`;
}

function getSpellLevelLabel(level: string | number): string {
	if (level == 0) return 'Cantrips';
	if (typeof level === 'string') level = parseInt(level, 10);
	level = Number.isNaN(level) ? (1).ordinalString() : level.ordinalString();

	return `${level} Level Spells`;
}

export default function getCategoryNames(type: string, value: string | number): string {
	if (type === 'monster') return getCRLabel(value);
	if (['5eSpell', 'spell'].includes(type)) return getSpellLevelLabel(value);
	if (type === 'maneuver') return getManueverDegreeLabel(value);
	if (['object', 'magicItem'].includes(type)) return getRarityLabel(value);

	return `${value}`;
}
