import { localize } from "#runtime/util/i18n";

import type SpellItemA5e from '../../documents/item/spell';

export default function getPsionicDisciplines(item: SpellItemA5e) {
	const { psionicDisciplines } = CONFIG.A5E;
	const { discipline } = item.system;

	const disciplines = discipline.map(
		(discipline) => localize(psionicDisciplines[discipline]) ?? discipline,
	) as string[];

	disciplines.sort((a, b) => a.localeCompare(b));

	return disciplines.join(", ");
}
