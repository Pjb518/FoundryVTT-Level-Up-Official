// @ts-nocheck
import applyHomebrewEntries from '#utils/applyHomebrewEntries.ts';

export default function registerHomebrewContentConfig() {
	applyHomebrewEntries(game.settings.get('a5e', 'homebrewContent'));
}
